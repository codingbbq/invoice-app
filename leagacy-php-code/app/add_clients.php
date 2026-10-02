
<?php include_once("partials/header.php") ?>

  <body class="add_clients">

   <?php include_once("partials/navigation.php") ?>

    <div class="container">

      <h1>Add Clients</h1>

      <!-- Add Client Form -->

      <div class="bs-callout">  

        <form name="form_add_clients" id="form_add_clients" class="form_add_clients" action="#">
          
          <div class="form-group has-feedback required">
            <label class="control-label" for="client_name">Client Name</label>
            <div class="input-group">
              <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
              <input name="client_name" placeholder="Client Name" class="form-control"  type="text">
            </div>
            <span class="glyphicon glyphicon-remove form-control-feedback hide" aria-hidden="true"></span>

          </div>

          <div class="form-group">
              <label for="client_gst_no">Client GST</label>
              <input type="text" class="form-control" id="client_gst_no" name="client_gst_no" placeholder="Client GST">
          </div>

          <div class="form-group">
              <label for="client_address">Client Address</label>
              <textarea id="client_address" name="client_address" class="form-control" rows="5"></textarea>
          </div>

          <div class="form-group">
            <label for="client_phone">Client Phone</label>
            <div class="input-group">
                <span class="input-group-addon"><i class="glyphicon glyphicon-earphone"></i></span>
                <input name="client_phone" placeholder="Client Phone" class="form-control" type="text">
            </div>
          </div>

          <div class="form-group">
            <label for="client_email">Client Email</label>
              <div class="input-group">
                  <span class="input-group-addon"><i class="glyphicon glyphicon-envelope"></i></span>
                  <input name="client_email" placeholder="E-Mail Address" class="form-control" type="text">
              </div>
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