<?php include_once("partials/header.php") ?>

  <body>

   <?php include_once("partials/navigation.php") ?>

    <div class="container">
      
    <h1>View Products</h1>

    <div class="bs-callout">

      <table class="table table-hover view_products">
      	<tr>
      		<th>Sr. No</th>
      		<th>Product Name</th>
          <th>HSN Code</th>
      		<th>Product Description</th>
          <th>Product MRP</th>
          <th>Action</th>
      	</tr>
        <tr class="loading">
              <td colspan="4">Loading..</td>
        </tr>
      </table>

      <?php include_once("partials/ConfirmModal.php") ?>
      
      </div><!--end .bs-callout-->

    </div><!-- /.container -->


    <?php include_once("partials/footer_js.php") ?>
    
  </body>
</html>