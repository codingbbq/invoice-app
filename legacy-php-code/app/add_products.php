<?php include_once("server/dbInformation.php") ?>
<?php 
  $product_name             = empty($edit_products["product_name"]) ? "" : $edit_products["product_name"];
  $product_description      = empty($edit_products["product_description"]) ? "" : $edit_products["product_description"];
  $product_mrp              = empty($edit_products["product_mrp"]) ? "" : $edit_products["product_mrp"];
  $title                    = empty($title)? "Add Products" : $title;
  $product_id               = empty($product_id)? "" : $product_id;
  $product_hsn_code         = empty($edit_products["product_hsn_code"]) ? "" : $edit_products["product_hsn_code"];
?>
<?php include_once("partials/header.php") ?>

  <body class="add_products">

   <?php include_once("partials/navigation.php") ?>

    <div class="container">

      <h1><?php echo $title; ?></h1>

      <!-- Add Client Form -->

      <div class="bs-callout">  
        
        <form name="form_add_products" class="form_add_products" action="#">
          
        <input type="hidden" name="product_id" value="<?php echo $product_id; ?>" />

          <div class="form-group has-feedback required">
            
            <label class="control-label" for="product_name">Product Name</label>

            <div class="input-group">
              <span class="input-group-addon"><i class="glyphicon glyphicon-th-large"></i></span>
              <input name="product_name" value="<?php echo $product_name; ?>" placeholder="Product Name" class="form-control" type="text">
            </div>
            <span class="glyphicon glyphicon-remove form-control-feedback hide" aria-hidden="true"></span>
            
          </div>

          <div class="form-group has-feedback required">
            
            <label class="control-label" for="product_hsn_code">HSN Code</label>

            <div class="input-group">
              <span class="input-group-addon"><i class="glyphicon glyphicon-th-large"></i></span>
              <input name="product_hsn_code" value="<?php echo $product_hsn_code; ?>" placeholder="HSN Code" class="form-control" type="text">
            </div>
            <span class="glyphicon glyphicon-remove form-control-feedback hide" aria-hidden="true"></span>
            
          </div>

          <div class="form-group">
              <label for="product_description">Product Description</label>
              <textarea id="product_description" name="product_description" class="form-control" rows="5"><?php echo $product_description; ?></textarea>
          </div>

          <div class="form-group has-feedback required">
            <label class="control-label" for="product_mrp">Product MRP</label>
            <div class="input-group">
              <span class="input-group-addon"><i class='fa fa-inr' aria-hidden='true'></i></span>
              <input name="product_mrp" value="<?php echo $product_mrp; ?>" placeholder="Product MRP" class="form-control"  type="text">
            </div>
            <span class="glyphicon glyphicon-remove form-control-feedback hide" aria-hidden="true"></span>
          </div>

          <button type="submit" class="btn btn-default">Submit</button>

        </form>
        
        <br />

        <div class="alert alert-success alert-dismissible hide" role="alert">
          <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <span class="alert-text"></span>
        </div>

        </div><!-- bs-callout -->

    </div><!-- /.container -->


    <?php include_once("partials/footer_js.php") ?>
    
  </body>
</html>