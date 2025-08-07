<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>{{ config('app.name', 'IBP ACADEMY') }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <style type="text/css">
        /* Reset Styles */
        body, html {
            margin: 0;
            padding: 0;
            width: 100% !important;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.5;
            background-color: #f7fafc;
            color: #4a5568;
        }

        /* Layout */
        .wrapper {
            width: 100%;
            min-width: 100%;
            table-layout: fixed;
            background-color: #f7fafc;
            padding: 40px 0;
        }

        .content {
            max-width: 600px;
            margin: 0 auto;
            width: 100%;
        }

        /* Email Body */
        .inner-body {
            width: 100%;
            max-width: 570px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            overflow: hidden;
        }

        .content-cell {
            padding: 40px;
            line-height: 1.6;
        }

        /* Typography */
        h1 {
            color: #2d3748;
            font-size: 24px;
            font-weight: 600;
            margin-top: 0;
            margin-bottom: 20px;
        }

        h2 {
            color: #2d3748;
            font-size: 20px;
            font-weight: 600;
            margin-top: 0;
            margin-bottom: 16px;
        }

        p {
            margin-top: 0;
            margin-bottom: 16px;
            font-size: 16px;
            line-height: 1.6;
        }

        a {
            color: #4299e1;
            text-decoration: underline;
        }

        /* Buttons */
        .button {
            display: inline-block;
            background-color: #4299e1;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 600;
            margin: 16px 0;
            text-align: center;
        }

        /* Footer */
        .footer {
            width: 100%;
            color: #718096;
            font-size: 14px;
            text-align: center;
            padding: 24px 0;
            line-height: 1.5;
        }

        /* Responsive Styles */
        @media only screen and (max-width: 620px) {
            .wrapper {
                padding: 16px 0 !important;
            }

            .content {
                width: 100% !important;
            }

            .inner-body {
                width: 100% !important;
                border-radius: 0 !important;
            }

            .content-cell {
                padding: 24px !important;
            }

            h1 {
                font-size: 20px !important;
            }

            h2 {
                font-size: 18px !important;
            }
        }

        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #1a202c !important;
            }

            .inner-body, .content-cell {
                background-color: #2d3748 !important;
            }

            h1, h2, h3 {
                color: #f7fafc !important;
            }

            p, td, li {
                color: #e2e8f0 !important;
            }

            .footer {
                color: #a0aec0 !important;
            }

            .button {
                background-color: #3182ce !important;
            }
        }
    </style>
</head>
<body>
    <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td align="center" valign="top">
                <table class="content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    {{ $header ?? '' }}

                    <!-- Email Body -->
                    <tr>
                        <td class="body" width="100%" cellpadding="0" cellspacing="0">
                            <table class="inner-body" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                                <!-- Body content -->
                                <tr>
                                    <td class="content-cell" align="left" valign="top">
                                        {{ Illuminate\Mail\Markdown::parse($slot) }}

                                        {{ $subcopy ?? '' }}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{ $footer ?? '' }}
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
