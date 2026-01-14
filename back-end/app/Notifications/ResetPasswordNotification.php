<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends Notification
{
    public $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

  public function toMail($notifiable)
{
    $url = config('app.frontend_url')
        . '/password-reset'
        . '?token=' . $this->token
        . '&email=' . urlencode($notifiable->email);

    return (new MailMessage)
        ->subject('Restableix la teva contrasenya')
        ->line('Fes clic al botó per restablir la teva contrasenya.')
        ->action('Restablir contrasenya', $url)
        ->line('Si no has demanat aquest canvi, ignora aquest correu.');
}
}
