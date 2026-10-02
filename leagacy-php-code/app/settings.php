
<?php include_once("partials/header.php") ?>

  <body class="settings">

   <?php include_once("partials/navigation.php") ?>

    <div class="container">

      <h1>Settings</h1>

      <!-- Add Company Form -->

      <div class="bs-callout">  

        <form name="form_settings" class="form_settings" action="#">
          
          <div class="form-group">
            <label for="company_name">Company Name</label>
            <div class="input-group">
              <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
              <input type="text" class="form-control" id="company_name" name="company_name" placeholder="Company Name">
            </div>
          </div>

          <div class="form-group">
              <label for="company_address">Company Address</label>
              <textarea id="company_address" name="company_address" class="form-control" rows="5"></textarea>
          </div>

          <div class="form-group">
            <label for="company_phone">Company Phone</label>
            <div class="input-group">
                <span class="input-group-addon"><i class="glyphicon glyphicon-earphone"></i></span>
                <input type="text" class="form-control" id="company_phone" name="company_phone" placeholder="Company Phone">
            </div>
          </div>

          <div class="form-group">
            <label for="company_email">Company Email</label>
            <div class="input-group">
                  <span class="input-group-addon"><i class="glyphicon glyphicon-envelope"></i></span>
                  <input type="email" class="form-control" id="company_email" name="company_email" placeholder="Company Email">
            </div>
          </div>

          <div class="form-group">
            <label for="company_vat">Company VAT Number</label>
            <div class="input-group">
                  <span class="input-group-addon"><i class="glyphicon glyphicon-info-sign"></i></span>
                  <input type="text" class="form-control" id="company_vat" name="company_vat" placeholder="Company VAT Number">
            </div>
          </div>

          <div class="form-group">
            <label for="company_cst">Company CST Number</label>
            <div class="input-group">
                  <span class="input-group-addon"><i class="glyphicon glyphicon-info-sign"></i></span>
                  <input type="text" class="form-control" id="company_cst" name="company_cst" placeholder="Company CST">
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