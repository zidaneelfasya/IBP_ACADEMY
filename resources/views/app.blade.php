<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="light">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="description" content="IBP (Industrial Business Project) 2025 is an international competition and innovation platform organized by the Business and Entrepreneurship Department of the Industrial Engineering Student Association at Universitas Brawijaya. As a medium for education and talent incubation, IBP aims to provide a comprehensive experience in the future world of industry and entrepreneurship through the implementation of the SDGs.">
    <meta name="keywords" content="IBP Academy, Industrial Business Project Academy, Academy, Competition, Lomba, Innovation, Entrepreneurship, Business, Industrial Engineering, Universitas Brawijaya, UB, SDGs, Sustainable Development Goals">
    <meta name="author" content="IBP Academy">
    <title inertia>{{ config('app.name', 'IBP ACADEMY') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
