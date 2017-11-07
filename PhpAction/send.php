<?php
//引入类
$rootPath = dirname(__FILE__);
require $rootPath . '/PHPMailer/class.phpmailer.php';
require $rootPath . '/PHPMailer/class.smtp.php';

$name = @trim(stripslashes($_POST['name']));
$email = @trim(stripslashes($_POST['email']));
$message = @trim(stripslashes($_POST['message']));

echo $name .'<br/>' . $email .'<br/>' .$message .'<br/>';

//实例化类
$mail = new PHPMailer;

$mail -> isSMTP();
// Set mailer to use SMTP
$mail -> Host = 'smtp.sina.com';
// Specify main and backup SMTP servers
$mail -> SMTPAuth = true;
// Enable SMTP authentication
$mail -> Username = 'heat2wear';
// SMTP username
$mail -> Password = 'heat2wear';
// SMTP password
$mail -> CharSet = 'UTF-8';

$mail -> setFrom('heat2wear@sina.com', 'WebSite');
$mail -> addAddress('Tommy@cerasol.com.hk', 'Contact');
// Add a recipient

$mail -> isHTML(true);
// Set email format to HTML

$mail -> Subject = '來自H2W網頁的E-mail';
$mail -> Body = 'Name:<b>    ' . $name . '</b> <br/><br/>E-mail:<b>    ' . $email . '</b><br/><br/>Message:<b>    ' . $message . '</b>';

if (!$mail -> send()) {
	echo 'Message could not be sent.';
	echo 'Mailer Error: ' . $mail -> ErrorInfo;
} else {
	echo 'Message has been sent';
}
?>

