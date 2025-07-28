# Laravel Inertia + React Starter

This repository provides a starter template for building web applications using [Laravel](https://laravel.com/), [Inertia.js](https://inertiajs.com/), and [React](https://react.dev/).

## Features

- Laravel backend
- Inertia.js for server-driven SPA
- React frontend

## Installation Guide

### Prerequisites

- PHP >= 8.1
- Composer
- Node.js & npm
- Database (MySQL, PostgreSQL, etc.)

### Steps

1. **Clone the repository**
  ```bash
  git clone https://github.com/your-username/your-repo.git
  cd your-repo
  ```

2. **Install PHP dependencies**
  ```bash
  composer install
  ```

3. **Install JavaScript dependencies**
  ```bash
  npm install
  ```

4. **Copy and configure environment file**
  ```bash
  cp .env.example .env
  # Edit .env to set your database and app settings
  ```
  

5. **Generate application key**
  ```bash
  php artisan key:generate
  ```

6. **Run migrations**
  ```bash
  php artisan migrate
  ```

7. **Start development servers**
  - Start Laravel backend:
    ```bash
    php artisan serve
    ```
  - Start React frontend (Vite):
    ```bash
    npm run dev
    ```

## Usage

Access your app at [http://localhost:8000](http://localhost:8000).

## Learn More

- [Laravel Docs](https://laravel.com/docs)
- [Inertia.js Docs](https://inertiajs.com/)
- [React Docs](https://react.dev/)
