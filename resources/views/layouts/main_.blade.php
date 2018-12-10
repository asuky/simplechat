<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name') }}</title>

    <!-- Scripts -->
@if(app('env') == 'dev')
    <script src="{{ asset('js/app.js') }}" defer></script>
@endif
@if(app('env') == 'prod')
    <script src="{{ secure_asset('js/app.js') }}" defer></script>
@endif
@if(app('env') == 'dev')
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
@endif
@if(app('env') == 'prod')
    <link href="{{ secure_asset('css/app.css') }}" rel="stylesheet">
@endif
    <!-- Styles -->
    
</head>
<body>
    @yield('content')
</body>
</html>
