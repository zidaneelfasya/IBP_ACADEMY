@props(['url'])
<tr>
    <td class="header" style="
        padding: 30px 0;
        text-align: center;
        background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
        border-radius: 8px 8px 0 0;
        width: 100%;
    ">
        <a href="{{ $url }}" style="
            display: inline-block;
            text-decoration: none;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            width: 100%;
        ">
            @if (trim($slot) === 'Laravel')
                <img src="https://i.imgur.com/SbgMIeW.png"
                     class="logo"
                     alt="{{ config('app.name') }} Logo"
                     style="
                        height: 60px;
                        width: auto;
                        max-width: 200px;
                        display: block;
                        margin: 0 auto;
                     ">
                <span style="
                    display: block;
                    font-size: 18px;
                    font-weight: 600;
                    margin-top: 10px;
                    color: white;
                ">
                    {{ config('app.name') }}
                </span>
            @else
                <span style="
                    font-size: 24px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    display: inline-block;
                    max-width: 100%;
                ">
                    {{ $slot }}
                </span>
            @endif
        </a>
    </td>
</tr>
