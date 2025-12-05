import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface User {
  id: number;
  email: string;
  username: string;
  energy: number;
  isAdmin: boolean;
  createdAt: string;
}

interface AdminPanelProps {
  adminUserId: number;
}

const AdminPanel = ({ adminUserId }: AdminPanelProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [energyAmount, setEnergyAmount] = useState('');
  const [description, setDescription] = useState('');

  const ADMIN_API = 'https://functions.poehali.dev/890c942f-4652-450f-922b-1228a2cbc3f9';

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${ADMIN_API}?action=users`, {
        headers: {
          'X-Admin-Id': adminUserId.toString()
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      toast.error('Не удалось загрузить пользователей');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateEnergy = async () => {
    if (!selectedUserId || !energyAmount) {
      toast.error('Заполните все поля');
      return;
    }

    try {
      const response = await fetch(ADMIN_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Id': adminUserId.toString()
        },
        body: JSON.stringify({
          action: 'updateEnergy',
          userId: selectedUserId,
          amount: parseInt(energyAmount),
          description: description || 'Выдача энергии администратором'
        })
      });

      if (!response.ok) throw new Error('Failed to update energy');

      const data = await response.json();
      toast.success(`Энергия обновлена! Новое значение: ${data.newEnergy}`);
      
      setEnergyAmount('');
      setDescription('');
      setSelectedUserId(null);
      fetchUsers();
    } catch (error) {
      toast.error('Не удалось обновить энергию');
      console.error(error);
    }
  };

  const toggleAdmin = async (userId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(ADMIN_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Id': adminUserId.toString()
        },
        body: JSON.stringify({
          action: 'setAdmin',
          userId: userId,
          isAdmin: !currentStatus
        })
      });

      if (!response.ok) throw new Error('Failed to update admin status');

      toast.success('Статус администратора обновлен');
      fetchUsers();
    } catch (error) {
      toast.error('Не удалось обновить статус');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icon name="Loader2" size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Панель администратора</h2>
          <p className="text-muted-foreground">Управление пользователями и энергией</p>
        </div>
        <Button onClick={fetchUsers} variant="outline">
          <Icon name="RefreshCw" size={18} className="mr-2" />
          Обновить
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Icon name="Users" size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Всего пользователей</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={24} className="text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Общая энергия</p>
              <p className="text-2xl font-bold">
                {users.reduce((sum, u) => sum + u.energy, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={24} className="text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Администраторов</p>
              <p className="text-2xl font-bold">
                {users.filter(u => u.isAdmin).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Имя пользователя</TableHead>
              <TableHead>Энергия</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата регистрации</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-mono">
                    <Icon name="Zap" size={12} className="mr-1" />
                    {user.energy.toLocaleString()}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.isAdmin && (
                    <Badge className="bg-accent">
                      <Icon name="Shield" size={12} className="mr-1" />
                      Admin
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedUserId(user.id)}
                        >
                          <Icon name="Zap" size={14} className="mr-1" />
                          Энергия
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Изменить энергию пользователя</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Пользователь</p>
                            <p className="font-medium">{user.username} ({user.email})</p>
                            <p className="text-sm text-muted-foreground">
                              Текущая энергия: <span className="font-bold text-primary">{user.energy}</span>
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">
                              Количество энергии (положительное - добавить, отрицательное - забрать)
                            </label>
                            <Input
                              type="number"
                              value={energyAmount}
                              onChange={(e) => setEnergyAmount(e.target.value)}
                              placeholder="100"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Описание</label>
                            <Input
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="Причина изменения..."
                            />
                          </div>
                          <Button onClick={updateEnergy} className="w-full">
                            <Icon name="Check" size={18} className="mr-2" />
                            Применить изменения
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      size="sm" 
                      variant={user.isAdmin ? "destructive" : "default"}
                      onClick={() => toggleAdmin(user.id, user.isAdmin)}
                    >
                      <Icon name="Shield" size={14} className="mr-1" />
                      {user.isAdmin ? 'Убрать' : 'Дать'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminPanel;
