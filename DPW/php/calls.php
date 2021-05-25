<?php

  include('dbconnection.php');

  if (isset($_GET['ObtenerRegistros'])) {
    ObtenerRegistros();
  }

  if(isset($_POST['Action']) && !empty($_POST['Action'])) {
    $action = $_POST['Action'];
    switch($action) {
        case 'RegistrarArticulo' :
          RegistrarArticulo();
        break;
        case 'EditarArticulo' :
          EditarArticulo();
        break;
        case 'EliminarArticulo' :
          EliminarArticulo();
        break;
        case 'BuscarRegistro' :
          BuscarRegistro();
        break;
    }
  }

  function EditarArticulo (){
    $nombre = $_POST['Nombre'];
    $proveedor = $_POST['Proveedor'];
    $cantidad = $_POST['Cantidad'];
    $precio = $_POST['Precio'];
    $id = $_POST['Id'];
    $pdo = OpenCon();
    $update = "UPDATE inventario SET `Nombre` = '$nombre',`Proveedor` = '$proveedor',`Cantidad` = $cantidad,`Precio` = $precio WHERE Id = $id";
    try {
        $statement=$pdo->prepare($update);
        $statement->execute();
        if($statement->rowCount() > 0){
            $count = $statement->rowCount();
            echo $count;
          } else{
              echo "Ha ocurrido un error al actualizar el registro";
          }
      } catch (PDOException $e) {
          print "¡Error!: " . $e->getMessage() . "<br/>";
          die();
      }
  }

  function RegistrarArticulo (){
    $nombre = $_POST['Nombre'];
    $proveedor = $_POST['Proveedor'];
    $cantidad = $_POST['Cantidad'];
    $precio = $_POST['Precio'];
    $pdo = OpenCon();
    $insert = "INSERT INTO inventario (`Nombre`,`Proveedor`,`Cantidad`,`Precio`) VALUES('$nombre','$proveedor', $cantidad, $precio)";
    try {
        $statement=$pdo->prepare($insert);
        $statement->execute();
        if($statement->rowCount() > 0){
            $count = $statement->rowCount();
            echo $count;
          } else{
              echo "Ha ocurrido al insertar los datos.";
          }
      } catch (PDOException $e) {
          print "¡Error!: " . $e->getMessage() . "<br/>";
          die();
      }
  }

  function ObtenerRegistros () 
  { 
    $jsondata = array();
    $pdo = OpenCon();
    try {
      $statement=$pdo->prepare("SELECT * FROM inventario");
      $statement->execute();
      while($r = $statement->fetchAll(PDO::FETCH_ASSOC)){
        $jsondata[] = array(
          'status' => 200,
          'data' => $r);
      }
      echo json_encode($jsondata);
    } catch (PDOException $e) {
        print "¡Error!: " . $e->getMessage() . "<br/>";
        die();
    }
  }

  function EliminarArticulo (){
    $id = $_POST['Id'];
    $pdo = OpenCon();
    $delete = "DELETE FROM inventario WHERE Id = $id";
    try {
        $statement=$pdo->prepare($delete);
        $statement->execute();
        if($statement->rowCount() > 0){
            $count = $statement->rowCount();
            echo $count;
          } else{
              echo "Ha ocurrido un error al eliminar el registro.";
          }
      } catch (PDOException $e) {
          print "¡Error!: " . $e->getMessage() . "<br/>";
          die();
      }
  }

  function BuscarRegistro () 
  { 
    $parametro = $_POST['Parametro'];
    $jsondata = array();
    $pdo = OpenCon();
    try {
      $statement=$pdo->prepare("SELECT * FROM inventario WHERE Nombre LIKE '%$parametro%'");
      $statement->execute();
      while($r = $statement->fetchAll(PDO::FETCH_ASSOC)){
        $jsondata[] = array(
          'status' => 200,
          'data' => $r);
      }
      echo json_encode($jsondata);
    } catch (PDOException $e) {
        print "¡Error!: " . $e->getMessage() . "<br/>";
        die();
    }
  }

  
?>