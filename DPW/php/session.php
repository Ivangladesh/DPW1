<?php
  include('dbconnection.php');
  date_default_timezone_set('America/Mexico_City');
  
  if(isset($_POST['Action']) && !empty($_POST['Action'])) {
    $action = $_POST['Action'];
    switch($action) {
        case 'IniciarSesion' : IniciarSesion();
        break;
        case 'ValidarSesion' : ValidarSesion();
        break;
    }
  }

  function IniciarSesion () 
  { 
    $username = $_POST['Username'];
    $password = $_POST['Password'];
    $pdo = OpenCon();
    $query = "SELECT Id, Username, Pass ,Activo FROM `sesionstorage` WHERE Username = ? AND Pass = ? ";
    try {
      $statement=$pdo->prepare($query);
      $statement->execute([$username, $password]);
      if($statement->rowCount() > 0){
        $user = $statement->fetch();
        GenerarToken($user);
      } else{
        $jsondata[] = array(
          'status' => 200,
          'data' => null);
          echo json_encode($jsondata);
      }
    } catch (PDOException $e) {
        print "¡Error!: " . $e->getMessage() . "<br/>";
        die();
    }
  }
  function GenerarToken ($r){
    $pdo = OpenCon();
    $id = $r['Id'];
    $username = $r['Username'];
    $hoy = date("m.d.y H:i:s");
    $token = $username.'|'.base64_encode($r['Id'] . $username . $r['Pass'] . $hoy);
    $insert = "UPDATE sesionstorage SET  CookieSession = '$token' WHERE Id = $id";
    try {
        $statement=$pdo->prepare($insert);
        $statement->execute();
        if($statement->rowCount() > 0){
            $count = $statement->rowCount();
            EnviarToken($id);
          } else{
            $jsondata[] = array(
              'status' => 200,
              'data' => null);
              echo json_encode($jsondata);
          }
      } catch (PDOException $e) {
          print "¡Error!: " . $e->getMessage() . "<br/>";
          die();
      }
  }

  function EnviarToken ($id){
    $pdo = OpenCon();
    $select = "SELECT CookieSession FROM `sesionstorage` WHERE Id = $id";
    try {
        $statement=$pdo->prepare($select);
        $statement->execute();
        if($statement->rowCount() > 0){
            $token = $statement->fetch();
            $jsondata[] = array(
              'status' => 200,
              'data' => $token[0]);
              echo json_encode($jsondata);
        } else{
            echo false;
        }
      } catch (PDOException $e) {
          print "¡Error!: " . $e->getMessage() . "<br/>";
          die();
      }
  }

  function ValidarSesion (){
    $token = $_POST['Token'];
    $pdo = OpenCon();
    $select = "SELECT NombreCompleto, CookieSession FROM `sesionstorage` WHERE CookieSession = '$token'";
    try {
        $statement=$pdo->prepare($select);
        $statement->execute();
        if($statement->rowCount() > 0){
            while($r = $statement->fetchAll(PDO::FETCH_ASSOC)){
                $jsondata[] = array(
                  'status' => 200,
                  'data' => $r);
              }
            echo json_encode($jsondata);
        } else{
            echo false;
        }
      } catch (PDOException $e) {
          print "¡Error!: " . $e->getMessage() . "<br/>";
          die();
      }
  }

?>