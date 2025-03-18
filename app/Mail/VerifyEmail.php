<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;


class VerifyEmail extends Mailable
{
    public $verificationToken;


    public function __construct($verificationToken)
    {
        $this->verificationToken = $verificationToken;
    }

    public function build()
    {
        return $this->subject('Verify Your Email Address')
                    ->view('emails.verify')
                    ->with([
                        'verificationLink' => route('admin.verify', ['token' => $this->verificationToken]),
                    ]);
    }
}

