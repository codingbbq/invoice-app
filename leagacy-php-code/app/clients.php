
<?php include_once("partials/header.php") ?>

  <body>

   <?php include_once("partials/navigation.php") ?>

    <div class="container">
      
    <h1>View Clients</h1>

    <div class="bs-callout">

      <table class="table table-hover view_clients">
      	<tr>
      		<th>Sr. No</th>
      		<th>Client Name</th>
          <th>Client GST</th>
      		<th>Client Address</th>
      		<th>Client Phone</th>
      		<th>Client Email</th>
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