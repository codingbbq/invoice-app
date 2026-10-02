<?php
require_once("class/MysqliDb.php");
$db = new MysqliDb ('localhost', 'root', '', 'invoice_app');


// Insert Products into the database.
if(isset($_REQUEST["add_products"]) && $_REQUEST["add_products"]== "true"){

	$product_id 		 =  empty($_REQUEST["product_id"]) ? "" : $_REQUEST["product_id"];

	$product_name		 = 	$_REQUEST["product_name"];
	$product_description = 	$_REQUEST["product_description"];
	$product_mrp		 =  $_REQUEST["product_mrp"];
	$product_hsn_code	 =  $_REQUEST["product_hsn_code"];

	$data = Array (	"product_name" 				=> $product_name,
               		"product_description" 		=> $product_description,
               		"product_mrp"				=> $product_mrp,
               		"product_hsn_code"			=> $product_hsn_code
			);

	if(!empty($product_id)){
		$data["product_id"]	= $product_id;
		$db->where ('product_id', $product_id);
		$id = $db->update('product', $data);
		
		if($id){
		    $message["success"] = $db->count . ' records were updated';
		}
		else{
		    $message["success"] = 'update failed: ' . $db->getLastError();
		}

	}else{

		$id = $db->insert ('product', $data);
		if($id){
		    $message["success"] = "Success!!! Product information inserted in the database";
		    $message["reset"]	= true;
		}else{
			$message["error"] = "Some error occurred";
		}
	}
	

	echo json_encode($message);

}

// Insert Clients into the database.
if(isset($_REQUEST["add_clients"]) && $_REQUEST["add_clients"]== "true"){

	$client_name		= 	$_REQUEST["client_name"];
	$client_address		= 	$_REQUEST["client_address"];
	$client_phone		=	$_REQUEST["client_phone"];
	$client_email		=	$_REQUEST["client_email"];
	$client_gst_no		=	$_REQUEST["client_gst_no"];


	$data = Array (	"client_name"			=> $client_name,
               		"client_address"		=> $client_address,
               		"client_phone"			=> $client_phone,
               		"client_email"			=> $client_email,
               		"client_gst_no"			=> $client_gst_no
			);

	$id = $db->insert ('clients', $data);

	if($id){
	    $message["success"] = "Success!!! Client information inserted in the database";
	}else{
		$message["error"] = "Some error occurred";
	}

	echo json_encode($message);

}

//View Products code
if(isset($_REQUEST["view_products"]) && $_REQUEST["view_products"] == "true"){
	$product = $db->get('product');
	echo json_encode($product);
}


// View Clients code
if(isset($_REQUEST["view_clients"]) && $_REQUEST["view_clients"] == "true"){
	$clients = $db->get('clients');
	echo json_encode($clients);
}

// Edit Clients and Get All Invoice Details
if(isset($_REQUEST["clientEdit"]) && $_REQUEST["clientEdit"] == "true" && isset($_REQUEST["client_id"])){
	$db->where ("client_id", $_REQUEST["client_id"]);
	$clients = $db->getOne('clients');

	$clientsId = $clients["client_id"];

	$db->where ("client_id", $clientsId);
	$invoice_details = $db->get("invoice");
}

// Edit clients into the database.
if(isset($_REQUEST["edit_clients"]) && $_REQUEST["edit_clients"] == "true"){
	
	$client_id			= 	$_REQUEST["client_id"];
	$client_name		= 	$_REQUEST["client_name"];
	$client_address		= 	$_REQUEST["client_address"];
	$client_phone		=	$_REQUEST["client_phone"];
	$client_email		=	$_REQUEST["client_email"];
	$client_gst_no		=	$_REQUEST["client_gst_no"];

	$data = Array (	"client_name"			=> $client_name,
               		"client_address"		=> $client_address,
               		"client_phone"			=> $client_phone,
               		"client_email"			=> $client_email,
               		"client_gst_no"			=> $client_gst_no
			);

	$db->where ('client_id', $client_id);
	if ($db->update ('clients', $data)){
	    $message["success"] = $db->count . ' records were updated';
	}
	else{
	    $message["success"] = 'update failed: ' . $db->getLastError();
	}

	echo json_encode($message);

	/*
	$data = Array (
	    'settings_name'			=> $_REQUEST['company_name'],
	    'settings_address'		=> $_REQUEST['company_address'],
	    'settings_phone'		=> $_REQUEST['company_phone'],
	    'settings_email'		=> $_REQUEST['company_email'],
	    'settings_vat'			=> $_REQUEST['company_vat'],
	    'settings_cst'			=> $_REQUEST['company_cst']
	);
	$db->where ('settings_id', 1);
	if ($db->update ('settings', $data)){
	    $message["success"] = $db->count . ' records were updated';
	}
	else{
	    $message["success"] = 'update failed: ' . $db->getLastError();
	}

	echo json_encode($message);
	*/
}


// Edit products and get all the product related information
if(isset($_REQUEST["productEdit"]) && $_REQUEST["productEdit"] == "true" && isset($_REQUEST["product_id"])){
	$title = "Edit Products";
	$product_id = $_REQUEST["product_id"];
	$db->where ("product_id", $product_id);
	$edit_products = $db->getOne('product');
}

// Settings Page
if(isset($_REQUEST["settings"]) && $_REQUEST["settings"] == "true"){
	$settings = $db->get('settings');
	echo json_encode($settings);
}


// Settings - Update into the database.
if(isset($_REQUEST["update_settings"]) && $_REQUEST["update_settings"] == "true"){

	$data = Array (
	    'settings_name'			=> $_REQUEST['company_name'],
	    'settings_address'		=> $_REQUEST['company_address'],
	    'settings_phone'		=> $_REQUEST['company_phone'],
	    'settings_email'		=> $_REQUEST['company_email'],
	    'settings_vat'			=> $_REQUEST['company_vat'],
	    'settings_cst'			=> $_REQUEST['company_cst']
	);
	$db->where ('settings_id', 1);
	if ($db->update ('settings', $data)){
	    $message["success"] = $db->count . ' records were updated';
	}
	else{
	    $message["success"] = 'update failed: ' . $db->getLastError();
	}

	echo json_encode($message);

}

// Get invoice Number
if(isset($_REQUEST["get_invoice_number"]) && $_REQUEST["get_invoice_number"] == "true"){
	$invoice = $db->getOne("invoice", "MAX(invoice_number) as invoice_number");
	echo json_encode($invoice);
}

// Store invoice details in DB
if(isset($_REQUEST["invoice_database"]) && $_REQUEST["invoice_database"] == "true"){

	$product_array = Array();
	$product_id = $_REQUEST["product"];
	$mrp = $_REQUEST["mrp"];
	$quantity = $_REQUEST["quantity"];
	$rate = $_REQUEST["rate"];
	$each_product_final_cost = $_REQUEST["total_cost"];

	foreach($product_id as $key => $pid){
		$product_array[$key] = Array (
			"product_id" 	=> $pid,
			"mrp"			=> $mrp[$key],
			"quantity"		=> $quantity[$key],
			"rate"			=> $rate[$key],
			"each_product_final_cost"	=> $each_product_final_cost[$key]
		);

	}

	$products_object = json_encode($product_array);
	$invoice_date = str_replace("/", "_", $_REQUEST['invoice_date']);
	$invoice_details = Array (
	    'client_id'				=> $_REQUEST['client_name_selection'],
	    'invoice_date'			=> $_REQUEST['invoice_date'],
	    'invoice_number'		=> $_REQUEST['invoice_number'],
	    'invoice_vat'			=> $_REQUEST['vat_applied'],
	    'invoice_discount'		=> $_REQUEST['discount_applied'],
	    'invoice_total'			=> $_REQUEST['invoice_total'],
	    'products_object'		=> $products_object,
	    'invoice_pdf_path'		=> "server/pdf/" . $_REQUEST['invoice_number'] . "_" . $invoice_date . ".pdf",
	);

	// When to Insert and When to Update : Do it based on Invoice Number
	$db->where ("invoice_number", $_REQUEST['invoice_number']);
	$invoice_no_from_db = $db->getOne ("invoice");
	
	if($invoice_no_from_db['invoice_number']){
		// Do update
		$db->where ('invoice_number', $_REQUEST['invoice_number']);
		$id = $db->update ('invoice', $invoice_details);

	}else{
		// Do insert
		$id = $db->insert ('invoice', $invoice_details);
	};

	if($id){
	    $message["success"] = "Success!!! Client information inserted in the database";
	}else{
		$message["error"] = "Some error occurred";
	}
	echo json_encode($message);
}


// Get client GST no.
if(isset($_REQUEST["get_client_gst"]) && $_REQUEST["get_client_gst"] == "true" && isset($_REQUEST["client_id"])){
	$db->where ("client_id", $_REQUEST["client_id"]);
	$clients = $db->getOne ("clients");
	$client_values = ["client_gst_no"=>$clients["client_gst_no"], "client_address"=>$clients["client_address"]];
	echo json_encode($client_values);
}

// Get the MRP and HSN of the product on the invoice page
if(isset($_REQUEST["get_product_mrp"]) && $_REQUEST["get_product_mrp"] == "true" && isset($_REQUEST["get_product_hsn"]) && $_REQUEST["get_product_hsn"] == "true" && isset($_REQUEST["product_id"])){
	$db->where ("product_id", $_REQUEST["product_id"]);
	$product = $db->getOne ("product");
	$product_values = ["product_mrp"=>$product["product_mrp"], "product_hsn"=>$product["product_hsn_code"]];
	echo json_encode($product_values);
}

// Delete the product
if(isset($_REQUEST["delete_product"]) && $_REQUEST["delete_product"] == "true" && isset($_REQUEST["id"])){
	$db->where('product_id', $_REQUEST["id"]);
	 if($db->delete('product')){
	 	echo json_encode("Successfully deleted product");
	 }
}

// Delete the Client
if(isset($_REQUEST["delete_client"]) && $_REQUEST["delete_client"] == "true" && isset($_REQUEST["id"])){
	$db->where('client_id', $_REQUEST["id"]);
	 if($db->delete('clients')){
	 	echo json_encode("Successfully deleted Client");
	 }
}


?>