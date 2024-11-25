<?php
require "connect.php";

$username=$_POST['username'];
$email=$_POST['email'];
$phone=$_POST['phone'];
$password=md5($_POST['password']);
$flag['success']=0;
if($res = mysqli_query($con,"insert into users values('','$username','$email','$phone','$password')"))
{
$flag['success']=1;
header('Location:login.html');
}else{
    header('Location:signup.html');
}

//print(json_encode($flag));
mysqli_close($con);
?>


?>