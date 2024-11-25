<?php
require "connect.php";
$flag['success'] = 0;
$email=$_POST['email'];
$password=$_POST['password'];
$encry_password=md5($password);
$flag['data'] = array();
if ($res = mysqli_query($con, "select * from users where  email='$email' and password ='$encry_password' limit 1")) {

if ($res->num_rows > 0) {
   // echo json_encode(['success' => true, 'message' => 'Login successful']);
     header('Location:products.html');
} else {
   // echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
    header('Location:login.html');
}

while ($row = mysqli_fetch_assoc($res)) {
$flag['data'][] = $row;
}
}
print(json_encode($flag));
mysqli_close($con);
?>