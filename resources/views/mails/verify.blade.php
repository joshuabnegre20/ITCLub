<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verification Code</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; text-align: center; }
        .code { font-size: 32px; font-weight: bold; color: #1e40af; margin: 20px 0; padding: 10px; background: #f1f5f9; border-radius: 5px; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>TMC IT Club</h1>
            <p>Email Verification</p>
        </div>
        <div class="content">
            <h2>Your Verification Code</h2>
            <p>Please use the following code to verify your account:</p>
            <div class="code">{{ $code }}</div>
            <p>This code will expire in 30 minutes.</p>
            <p>If you didn't request this verification, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} TMC IT Club. All rights reserved.</p>
        </div>
    </div>
</body>
</html>