<?php include_once("server/dbInformation.php") ?>
<?php 
  $client_id        = empty($clients["client_id"]) ? "" : $clients["client_id"];
  $client_name      = empty($clients["client_name"]) ? "" : $clients["client_name"];
  $client_address   = empty($clients["client_address"]) ? "" : $clients["client_address"];
  $client_phone     = empty($clients["client_phone"]) ? "" : $clients["client_phone"];
  $client_email     = empty($clients["client_email"]) ? "" : $clients["client_email"];
  $client_gst_no    = empty($clients["client_gst_no"]) ? "" : $clients["client_gst_no"]; 
?>
<?php include_once("partials/header.php") ?>

  <body class="edit_clients">

   <?php include_once("partials/navigation.php") ?>

    <div class="container">

      <h2><span class="glyphicon glyphicon-user"></span> <?php echo $client_name; ?></h2>

      <!-- Add Client Form -->

      <div class="row">

        <div class="col-md-6">
          <div class="col-md-12 bs-callout">

            <form name="form_edit_clients" id="form_edit_clients" class="form_edit_clients" action="#">
              <div class="form-group">
                <label for="client_name">Client Name</label>

                <div class="input-group">
                  <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
                  <input type="text" name="client_name" value="<?php echo $client_name; ?>" class="form-control" id="client_name" placeholder="Client Name">
                </div>
                <span class="glyphicon glyphicon-remove form-control-feedback hide" aria-hidden="true"></span>
                <input type="hidden" name="client_id" value="<?php echo $client_id; ?>">
              </div>

              <div class="form-group">
                  
                  <label for="client_gst_no">Client GST</label>
                  <input type="text" name="client_gst_no" value="<?php echo $client_gst_no; ?>" class="form-control" id="client_gst_no" placeholder="Client GST">

              </div>

              <div class="form-group">
                  
                  <label for="client_address">Client Address</label>
                  <textarea id="client_address" name="client_address" class="form-control" rows="5"><?php echo $client_address; ?></textarea>

              </div>

              <div class="form-group">
                <label for="client_phone">Client Phone</label>
                
                <div class="input-group">
                    <span class="input-group-addon"><i class="glyphicon glyphicon-earphone"></i></span>
                    <input type="text" name="client_phone" value="<?php echo $client_phone; ?>" class="form-control" id="client_phone" placeholder="Client Phone">
                </div>
              </div>

              <div class="form-group">
                <label for="client_email">Client Email</label>
                
                <div class="input-group">
                  <span class="input-group-addon"><i class="glyphicon glyphicon-envelope"></i></span>
                  <input type="email" name="client_email" value="<?php echo $client_email; ?>" class="form-control" id="client_email" placeholder="Client Name">
                </div>

              </div>

              <button type="submit" class="btn btn-default">Submit</button>
            </form>

             <br />

            <div class="alert alert-success alert-dismissible hide" role="alert">
              <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <span class="alert-text"></span>
            </div>

          </div>


        
        </div>

        <div class="col-md-6">
          <div class="col-md-12 bs-callout">
            
            <h3>Invoice History</h3>          
            <table class="table">
              <tr>
                <th>Sr No.</th>
                <th>Invoice Date</th>
                <th>Invoice Total</th>
                <th>View Invoice</th>
              </tr>
              
              <?php if(count($invoice_details) > 0){ ?>

                <?php $j = 0; ?>
                <?php foreach($invoice_details as $invoice) { ?>
                  <tr>
                    <td><?php echo ++$j; ?></td>
                    <td><?php echo $invoice["invoice_date"]; ?></td>
                    <td><i class='fa fa-inr' aria-hidden='true'></i> <?php echo $invoice["invoice_total"]; ?></td>
                    <td><a target="_blank" class="btn btn-default" href="<?php echo $invoice['invoice_pdf_path']; ?>" role="button"><span class="glyphicon glyphicon-download-alt"></span> Download</a></td>
                  </tr>
                <?php } ?>

              <?php }else{ ?>
                <tr>
                  <td colspan="4" class="text-center">No Records Found!!!</td>
                </tr>
              <?php } ?>

            </table>

          </div><!--end .col-md-12-->

        </div>

      </div>
        
    </div><!-- /.container -->


    <?php include_once("partials/footer_js.php") ?>
    
  </body>
</html>