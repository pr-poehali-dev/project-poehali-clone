import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface User {
  email: string;
  username: string;
  energy: number;
  isAdmin: boolean;
}

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [activeSection, setActiveSection] = useState('home');

  const handleLogin = () => {
    if (loginEmail === 'den.nazarenko.02@internet.ru' && loginPassword === 'asddsa111') {
      setUser({
        email: loginEmail,
        username: 'Yehali',
        energy: Infinity,
        isAdmin: true
      });
      setIsLoggedIn(true);
      toast.success('Добро пожаловать, Админ!');
    } else {
      const mockUser = {
        email: loginEmail,
        username: loginEmail.split('@')[0],
        energy: 100,
        isAdmin: false
      };
      setUser(mockUser);
      setIsLoggedIn(true);
      toast.success('Вход выполнен успешно!');
    }
  };

  const handleRegister = () => {
    if (registerEmail === 'den.nazarenko.02@internet.ru') {
      setUser({
        email: registerEmail,
        username: 'Yehali',
        energy: 100000,
        isAdmin: true
      });
    } else {
      setUser({
        email: registerEmail,
        username: registerUsername,
        energy: 100,
        isAdmin: false
      });
    }
    setIsLoggedIn(true);
    toast.success('Регистрация прошла успешно! Получено 100 энергии 🎉');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    toast.info('Вы вышли из системы');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 animate-fade-in">
            <span className="text-3xl">🚀</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Уехали
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => setActiveSection('home')} className="hover:text-primary transition-colors">Главная</button>
            <button onClick={() => setActiveSection('team')} className="hover:text-primary transition-colors">О команде</button>
            <button onClick={() => setActiveSection('services')} className="hover:text-primary transition-colors">Услуги</button>
            <button onClick={() => setActiveSection('portfolio')} className="hover:text-primary transition-colors">Портфолио</button>
            <button onClick={() => setActiveSection('blog')} className="hover:text-primary transition-colors">Блог</button>
            <button onClick={() => setActiveSection('contact')} className="hover:text-primary transition-colors">Контакты</button>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn && user ? (
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-sm">
                  <Icon name="Zap" size={14} className="mr-1" />
                  {user.energy === Infinity ? '∞' : user.energy} энергии
                </Badge>
                {user.isAdmin && (
                  <Badge className="bg-accent text-accent-foreground">Admin</Badge>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Icon name="User" size={16} className="mr-2" />
                      {user.username}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Профиль пользователя</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Имя пользователя</p>
                        <p className="font-medium">{user.username}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Энергия</p>
                        <p className="font-medium text-2xl text-primary">
                          {user.energy === Infinity ? '∞' : user.energy}
                        </p>
                      </div>
                      <Button onClick={handleLogout} variant="destructive" className="w-full">
                        Выйти
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">Вход</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Вход в систему</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input 
                          type="email" 
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="example@email.com"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Пароль</label>
                        <Input 
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••"
                        />
                      </div>
                      <Button onClick={handleLogin} className="w-full">Войти</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                      Регистрация
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Регистрация</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input 
                          type="email"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          placeholder="example@email.com"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Имя пользователя</label>
                        <Input 
                          value={registerUsername}
                          onChange={(e) => setRegisterUsername(e.target.value)}
                          placeholder="username"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Пароль</label>
                        <Input 
                          type="password"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          placeholder="••••••"
                        />
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg flex items-start gap-2">
                        <Icon name="Gift" size={20} className="text-primary mt-1" />
                        <p className="text-sm">При регистрации вы получите <span className="font-bold text-primary">100 энергии</span> для создания сайтов!</p>
                      </div>
                      <Button onClick={handleRegister} className="w-full bg-gradient-to-r from-primary to-secondary">
                        Зарегистрироваться
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="pt-24">
        {activeSection === 'home' && (
          <>
            <section className="container mx-auto px-4 py-20 text-center animate-fade-in">
              <div className="max-w-4xl mx-auto space-y-6">
                <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                  <Icon name="Sparkles" size={14} className="mr-2" />
                  Создание сайтов через ИИ
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  Создавай сайты
                  <br />
                  <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    силой мысли
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Искусственный интеллект превратит ваши идеи в готовые сайты за считанные минуты. Без кода, без сложностей.
                </p>
                <div className="flex gap-4 justify-center pt-4">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8">
                    <Icon name="Rocket" size={20} className="mr-2" />
                    Начать создавать
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    <Icon name="Play" size={20} className="mr-2" />
                    Посмотреть демо
                  </Button>
                </div>
              </div>
            </section>

            <section className="container mx-auto px-4 py-20">
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: 'Wand2', title: 'ИИ-генерация', desc: 'Опишите идею - получите готовый сайт' },
                  { icon: 'Zap', title: 'Быстрый старт', desc: 'От идеи до результата за 5 минут' },
                  { icon: 'Palette', title: 'Любой дизайн', desc: 'Адаптивный дизайн под любые устройства' },
                  { icon: 'Code', title: 'Чистый код', desc: 'React + TypeScript + современные технологии' },
                  { icon: 'Globe', title: 'Публикация', desc: 'Мгновенное размещение в интернете' },
                  { icon: 'Shield', title: 'Безопасность', desc: 'SSL-сертификаты и защита данных' }
                ].map((feature, i) => (
                  <Card key={i} className="p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                      <Icon name={feature.icon as any} size={24} className="text-background" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </Card>
                ))}
              </div>
            </section>

            <section className="container mx-auto px-4 py-20">
              <div className="text-center mb-12 animate-fade-in">
                <h2 className="text-4xl font-bold mb-4">Как это работает</h2>
                <p className="text-muted-foreground text-lg">Три простых шага до вашего сайта</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {[
                  { step: '01', title: 'Опишите идею', desc: 'Расскажите ИИ, какой сайт вам нужен', icon: 'MessageSquare' },
                  { step: '02', title: 'ИИ создает сайт', desc: 'Нейросеть генерирует дизайн и код за минуты', icon: 'Sparkles' },
                  { step: '03', title: 'Публикуйте', desc: 'Один клик - и сайт доступен всему миру', icon: 'CheckCircle2' }
                ].map((step, i) => (
                  <div key={i} className="relative animate-scale-in" style={{ animationDelay: `${i * 0.2}s` }}>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                        {step.step}
                      </div>
                      <div className="w-12 h-12 bg-card rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary">
                        <Icon name={step.icon as any} size={24} className="text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.desc}</p>
                    </div>
                    {i < 2 && (
                      <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeSection === 'team' && (
          <section className="container mx-auto px-4 py-20 animate-fade-in">
            <h2 className="text-4xl font-bold text-center mb-12">О команде</h2>
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <p className="text-lg text-muted-foreground">
                Мы - команда энтузиастов, которая верит в силу искусственного интеллекта и его способность демократизировать веб-разработку.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-12">
                {[
                  { name: 'Команда разработки', role: 'Создаем магию ИИ', icon: 'Code2' },
                  { name: 'Дизайн-команда', role: 'Делаем красиво', icon: 'Palette' }
                ].map((member, i) => (
                  <Card key={i} className="p-6 hover:border-primary/50 transition-all">
                    <Icon name={member.icon as any} size={40} className="mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                    <p className="text-muted-foreground">{member.role}</p>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'services' && (
          <section className="container mx-auto px-4 py-20 animate-fade-in">
            <h2 className="text-4xl font-bold text-center mb-12">Наши услуги</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Лендинги', desc: 'Продающие одностраничники для вашего бизнеса', price: '100 энергии', icon: 'FileText' },
                { title: 'Корпоративные сайты', desc: 'Многостраничные сайты для компаний', price: '300 энергии', icon: 'Building2' },
                { title: 'Интернет-магазины', desc: 'Полноценные e-commerce решения', price: '500 энергии', icon: 'ShoppingCart' },
                { title: 'Блоги', desc: 'Платформы для контента и SEO', price: '200 энергии', icon: 'BookOpen' },
                { title: 'Портфолио', desc: 'Личные сайты для творческих людей', price: '150 энергии', icon: 'Image' },
                { title: 'Веб-приложения', desc: 'Интерактивные SPA приложения', price: '800 энергии', icon: 'Layers' }
              ].map((service, i) => (
                <Card key={i} className="p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                    <Icon name={service.icon as any} size={24} className="text-background" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.desc}</p>
                  <Badge variant="secondary">{service.price}</Badge>
                </Card>
              ))}
            </div>
          </section>
        )}

        {activeSection === 'portfolio' && (
          <section className="container mx-auto px-4 py-20 animate-fade-in">
            <h2 className="text-4xl font-bold text-center mb-12">Портфолио</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Icon name="Globe" size={48} className="text-primary/50" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-2">Проект #{i}</h3>
                    <p className="text-sm text-muted-foreground">Создан с помощью ИИ за 5 минут</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {activeSection === 'blog' && (
          <section className="container mx-auto px-4 py-20 animate-fade-in">
            <h2 className="text-4xl font-bold text-center mb-12">Блог</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                { title: 'Как ИИ меняет веб-разработку', date: '5 декабря 2024', icon: 'Newspaper' },
                { title: '10 трендов веб-дизайна 2024', date: '1 декабря 2024', icon: 'TrendingUp' },
                { title: 'От идеи до запуска за 24 часа', date: '28 ноября 2024', icon: 'Clock' }
              ].map((post, i) => (
                <Card key={i} className="p-6 hover:border-primary/50 transition-all cursor-pointer hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name={post.icon as any} size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground">{post.date}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {activeSection === 'contact' && (
          <section className="container mx-auto px-4 py-20 animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12">Контакты</h2>
              <Card className="p-8">
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); toast.success('Сообщение отправлено!'); }}>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Имя</label>
                    <Input placeholder="Ваше имя" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input type="email" placeholder="email@example.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Сообщение</label>
                    <Textarea placeholder="Расскажите о вашем проекте..." rows={5} />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary">
                    <Icon name="Send" size={18} className="mr-2" />
                    Отправить сообщение
                  </Button>
                </form>

                <div className="mt-8 pt-8 border-t border-border space-y-4">
                  <h3 className="font-bold text-lg mb-4">Свяжитесь с нами</h3>
                  <a 
                    href="https://t.me/FreeWebCreator" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Icon name="Send" size={20} className="text-accent" />
                    <div>
                      <p className="font-medium">Telegram канал</p>
                      <p className="text-sm text-muted-foreground">@FreeWebCreator</p>
                    </div>
                  </a>
                  <a 
                    href="https://t.me/+pJ_2ss_PeTplYzgy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Icon name="Lock" size={20} className="text-primary" />
                    <div>
                      <p className="font-medium">Секретный чат</p>
                      <p className="text-sm text-muted-foreground">Закрытое сообщество</p>
                    </div>
                  </a>
                  <a 
                    href="https://t.me/InfernoClient" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Icon name="User" size={20} className="text-secondary" />
                    <div>
                      <p className="font-medium">Личная связь</p>
                      <p className="text-sm text-muted-foreground">@InfernoClient</p>
                    </div>
                  </a>
                </div>
              </Card>
            </div>
          </section>
        )}

        <section className="container mx-auto px-4 py-20">
          <Card className="bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border-primary/30 p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Готовы к запуску?</h2>
            <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
              Присоединяйтесь к тысячам пользователей, которые уже создают сайты с помощью ИИ
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                asChild
              >
                <a href="https://inferno-client-clone--preview.poehali.dev/" target="_blank" rel="noopener noreferrer">
                  <Icon name="ExternalLink" size={20} className="mr-2" />
                  Наш другой проект
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                asChild
              >
                <a href="https://t.me/FreeWebCreator" target="_blank" rel="noopener noreferrer">
                  <Icon name="Send" size={20} className="mr-2" />
                  Telegram канал
                </a>
              </Button>
            </div>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 Уехали. Создание сайтов через ИИ.</p>
          <div className="flex gap-6 justify-center mt-4">
            <a href="https://t.me/FreeWebCreator" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Telegram
            </a>
            <a href="https://t.me/InfernoClient" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Поддержка
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
