# Embeddable Chord Trainer

Компактная версия приложения для встраивания в веб-страницы через iframe.

## 🎯 Особенности встраиваемой версии

- **Компактный дизайн** - оптимизирован для небольших размеров
- **Адаптивность** - подстраивается под размер контейнера
- **Полная функциональность** - все возможности основного приложения
- **Изолированные настройки** - не влияют на основное приложение
- **Кроссбраузерность** - работает во всех современных браузерах

## 📋 Как встроить

### Базовое встраивание:
```html
<iframe 
    src="https://chord-trainer-minimalist.windsurf.build/embed.html"
    width="400" 
    height="300"
    frameborder="0"
    title="Chord Trainer">
</iframe>
```

### Адаптивное встраивание:
```html
<div style="position: relative; width: 100%; height: 300px;">
    <iframe 
        src="https://chord-trainer-minimalist.windsurf.build/embed.html"
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
        frameborder="0"
        title="Chord Trainer">
    </iframe>
</div>
```

### Встраивание с фиксированным соотношением сторон:
```html
<div style="position: relative; width: 100%; padding-bottom: 75%; /* 4:3 aspect ratio */">
    <iframe 
        src="https://chord-trainer-minimalist.windsurf.build/embed.html"
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
        frameborder="0"
        title="Chord Trainer">
    </iframe>
</div>
```

## 📐 Рекомендуемые размеры

- **Минимальный размер:** 300x200px
- **Оптимальный размер:** 400x300px
- **Для мобильных:** 100% ширины, высота 250-300px
- **Соотношение сторон:** 4:3 или 16:10

## 🎨 Стилизация

Встраиваемая версия автоматически адаптируется к размеру iframe и поддерживает:

- **Темная тема** (по умолчанию)
- **Светлая тема** (переключается пользователем)
- **Адаптивные шрифты** - автоматически масштабируются
- **Компактные элементы управления** - оптимизированы для небольших размеров

## 🔧 Управление

- **Пробел** - ручная смена аккорда
- **Наведение на 🎹** - показать настройки
- **Настройки:**
  - Интервал смены аккордов: 2-5 секунд
  - Длительность сессии: 5-15 минут
  - Переключение темы: 🌙/☀️

## 💾 Сохранение настроек

Настройки встраиваемой версии сохраняются отдельно от основного приложения в localStorage с префиксом `chordTrainerEmbedSettings`.

## 🌐 Примеры использования

### Музыкальный блог:
```html
<h3>Потренируйтесь с аккордами:</h3>
<iframe 
    src="https://chord-trainer-minimalist.windsurf.build/embed.html"
    width="100%" 
    height="300"
    style="border: 1px solid #ddd; border-radius: 8px;">
</iframe>
```

### Боковая панель:
```html
<div class="sidebar-widget">
    <h4>Chord Practice</h4>
    <iframe 
        src="https://chord-trainer-minimalist.windsurf.build/embed.html"
        width="250" 
        height="200"
        frameborder="0">
    </iframe>
</div>
```

### Модальное окно:
```html
<div class="modal">
    <iframe 
        src="https://chord-trainer-minimalist.windsurf.build/embed.html"
        width="500" 
        height="400"
        frameborder="0">
    </iframe>
</div>
```

## 🔒 Безопасность

- Iframe изолирован от родительской страницы
- Нет доступа к cookies родительского сайта
- Использует только localStorage для настроек
- Не выполняет внешних запросов (кроме Google Fonts)

## 📱 Мобильная совместимость

Встраиваемая версия полностью адаптивна и корректно работает на:
- iOS Safari
- Android Chrome
- Мобильных браузерах
- Планшетах

Рекомендуется использовать `viewport` meta-тег на родительской странице:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
