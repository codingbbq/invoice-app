<?php

function base64_to_pdf($base64_string, $fname) {
    $ifp = fopen("pdf/" .$fname, "wb"); 

    $data = explode(',', $base64_string);

    fwrite($ifp, base64_decode($data[1])); 
    fclose($ifp); 

    return $fname; 
}

if(!empty($_POST['data'])){
    $data = $_POST['data'];
    //$fname = "something.pdf";
    $fname = $_POST['filename']; // name the file
    base64_to_pdf($data, $fname);
} else {
    echo "No Data Sent";
}

?>