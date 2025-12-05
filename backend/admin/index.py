import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Админ API для управления пользователями и энергией
    Args: event - dict с httpMethod, body, queryStringParameters
          context - object с атрибутами request_id, function_name
    Returns: HTTP response dict
    """
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers_dict = event.get('headers', {})
    admin_id = headers_dict.get('X-Admin-Id') or headers_dict.get('x-admin-id')
    
    if not admin_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Admin authentication required'}),
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database configuration error'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    try:
        cur.execute("SELECT is_admin FROM users WHERE id = %s", (admin_id,))
        admin_check = cur.fetchone()
        
        if not admin_check or not admin_check[0]:
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Admin access required'}),
                'isBase64Encoded': False
            }
        
        if method == 'GET':
            action = event.get('queryStringParameters', {}).get('action')
            
            if action == 'users':
                cur.execute(
                    "SELECT id, email, username, energy, is_admin, created_at FROM users ORDER BY created_at DESC"
                )
                users = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'users': [
                            {
                                'id': u[0],
                                'email': u[1],
                                'username': u[2],
                                'energy': u[3],
                                'isAdmin': u[4],
                                'createdAt': u[5].isoformat() if u[5] else None
                            }
                            for u in users
                        ]
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'transactions':
                user_id = event.get('queryStringParameters', {}).get('userId')
                
                if user_id:
                    cur.execute(
                        "SELECT id, user_id, amount, transaction_type, description, created_at FROM energy_transactions WHERE user_id = %s ORDER BY created_at DESC LIMIT 50",
                        (user_id,)
                    )
                else:
                    cur.execute(
                        "SELECT id, user_id, amount, transaction_type, description, created_at FROM energy_transactions ORDER BY created_at DESC LIMIT 100"
                    )
                
                transactions = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'transactions': [
                            {
                                'id': t[0],
                                'userId': t[1],
                                'amount': t[2],
                                'type': t[3],
                                'description': t[4],
                                'createdAt': t[5].isoformat() if t[5] else None
                            }
                            for t in transactions
                        ]
                    }),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'updateEnergy':
                user_id = body_data.get('userId')
                amount = body_data.get('amount')
                description = body_data.get('description', 'Admin adjustment')
                
                if not user_id or amount is None:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing userId or amount'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "UPDATE users SET energy = energy + %s, updated_at = NOW() WHERE id = %s RETURNING energy",
                    (amount, user_id)
                )
                result = cur.fetchone()
                
                if not result:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'User not found'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "INSERT INTO energy_transactions (user_id, amount, transaction_type, description) VALUES (%s, %s, %s, %s)",
                    (user_id, amount, 'admin_adjustment', description)
                )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'newEnergy': result[0], 'success': True}),
                    'isBase64Encoded': False
                }
            
            elif action == 'setAdmin':
                user_id = body_data.get('userId')
                is_admin = body_data.get('isAdmin')
                
                if not user_id or is_admin is None:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing userId or isAdmin'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "UPDATE users SET is_admin = %s, updated_at = NOW() WHERE id = %s",
                    (is_admin, user_id)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()
