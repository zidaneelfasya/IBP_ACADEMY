@props([
    'url',
    'color' => 'primary',
    'align' => 'center',
    'size' => 'medium' // Added size prop
])
<table class="action" align="{{ $align }}" width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td align="{{ $align }}">
<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td align="{{ $align }}">
<table border="0" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td>
<a href="{{ $url }}" class="button button-{{ $color }} button-{{ $size }}" target="_blank" rel="noopener" style="
    display: inline-block;
    text-decoration: none;
    border-radius: 6px;
    transition: all 0.2s ease;
    font-weight: 600;
    text-align: center;
    mso-padding-alt: 0;
    -webkit-text-size-adjust: none;
">{{ $slot }}</a>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>

<style>
    /* Button Base Styles */
    .button {
        display: inline-block;
        text-decoration: none;
        border-radius: 6px;
        transition: all 0.2s ease;
        font-weight: 600;
        text-align: center;
        mso-padding-alt: 0;
        -webkit-text-size-adjust: none;
    }

    /* Button Sizes */
    .button-small {
        padding: 10px 20px;
        font-size: 13px;
    }
    .button-medium {
        padding: 12px 24px;
        font-size: 15px;
    }
    .button-large {
        padding: 16px 32px;
        font-size: 16px;
    }

    /* Button Colors */
    .button-primary {
        background-color: #3B82F6;
        color: #FFFFFF !important;
        border: 1px solid #3B82F6;
    }
    .button-primary:hover {
        background-color: #2563EB;
        border-color: #2563EB;
    }

    .button-secondary {
        background-color: #6B7280;
        color: #FFFFFF !important;
        border: 1px solid #6B7280;
    }
    .button-secondary:hover {
        background-color: #4B5563;
        border-color: #4B5563;
    }

    .button-success {
        background-color: #10B981;
        color: #FFFFFF !important;
        border: 1px solid #10B981;
    }
    .button-success:hover {
        background-color: #059669;
        border-color: #059669;
    }

    .button-danger {
        background-color: #EF4444;
        color: #FFFFFF !important;
        border: 1px solid #EF4444;
    }
    .button-danger:hover {
        background-color: #DC2626;
        border-color: #DC2626;
    }

    /* Outline Variant */
    .button-outline {
        background-color: transparent !important;
    }
    .button-outline.button-primary {
        color: #3B82F6 !important;
    }
    .button-outline.button-secondary {
        color: #6B7280 !important;
    }
    .button-outline.button-success {
        color: #10B981 !important;
    }
    .button-outline.button-danger {
        color: #EF4444 !important;
    }
</style>
