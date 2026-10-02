
<?php include_once("partials/header.php") ?>

  <body class="invoice_page">

   <?php include_once("partials/navigation.php") ?>

    <div class="container">
      
    <h1>Create Invoice</h1>

      <form name="form_invoice" action="#" id="form_invoice" class="form_invoice">

      <div class="bs-callout">

            <div class="row">

                  <div class="col-md-4">
                        <div class="form-group required">
                              <label class="control-label" for="client_name_selection">Client Name</label>
                              <select name="client_name_selection" name="client_name_selection" class="client_name_selection form-control">
                                <option value="">Select Client Name</option>
                              </select>
                        </div>

                        <div class="form-group">
                              <label for="client_gst">Client GST</label>
                              <input type="text" class="form-control client_gst" id="client_gst" name="client_gst" placeholder="Client GST">
                              <input type="hidden" class="form-control client_address" id="client_address" name="client_address">
                          </div>
                  </div>

                  <div class="col-md-4">
                         <div class="form-group required">
                            <label class="control-label" for="invoice_date">Invoice Date</label>
                            <div class='input-group date' id='invoice_date'>
                                <input type='text' name="invoice_date" class="invoice_date form-control" />
                                <span class="input-group-addon">
                                    <span class="glyphicon glyphicon-calendar"></span>
                                </span>
                            </div>
                        </div>
                  </div>
                  <div class="col-md-4">                 
                        <div class="form-group">
                              <label for="invoice_number">Invoice Number</label>
                              <input type="number" class="form-control invoice_number" id="invoice_number" name="invoice_number" readonly="readonly" placeholder="Invoice Number">
                        </div>


                        <div class="form-group">
                              <label for="vat_applied">GST</label>

                              <div class="input-group">
                                <select name="vat_applied" id="vat_applied" class="form-control">
                                  <option value="0">Select GST</option>
                                    <option value="0">0</option>
		<option value="5.0">5.0</option>
                                  <option value="12.0">12.0</option>
                                  <option value="18.0">18.0</option>
                                </select>  
                                <div class="input-group-addon">%</div>
                              </div>
                              
                        </div>

                        <div class="form-group">
                          <label for="discount_applied">Discount</label>
                          <div class="input-group">
                              <input type="number" step="0.10" name="discount_applied" class="form-control discount_applied" id="discount_applied" min="0" max="100" value="0" placeholder="Discount">
                              <div class="input-group-addon">%</div>
                          </div>
                        </div>

                        
                  </div>



            </div><!-- end row-->
      
      </div><!--end .bs-callout-->

      <div class="bs-callout">

            <table class="invoice_table table table-striped">
              <tr>
                    <th>Product</th>
                    <th>HSN</th>
                    <th>MRP</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Total Cost</th>
                    <th></th>
              </tr>

              <tr class="row_item">
                    <td>
                      <div class="required">
                        <select name="product[]" class="product form-control">
                          <option value="">Select Products</option>
                        </select>
                      </div>
                    </td>

                    <td>
                      <div>
                          <input type="number" name="product_hsn[]" class="product_hsn form-control" id="product_hsn" value="0">
                      </div>
                    </td>
                    
                    <td width="15%">
                      <input type="hidden" name="discount[]" class="discount" value="" />
                      <input type="hidden" name="vat_bifercation[]" class="vat_bifercation" value="0" />
                      <div class="required">
                        <input type="number" name="mrp[]" class="mrp form-control" id="mrp" value="0" min="0" placeholder="Amount">
                      </div>
                    </td>

                    <td width="10%">
                      <div class="required">
                          <input type="number" name="quantity[]" class="quantity form-control" id="quantity" value="0" min="0" max="1500">
                      </div>
                    </td>

                    <td width="15%">
                        <input type="text" name="rate[]" class="rate disabled_fields form-control text-center" id="rate" value="0" min="0" readonly="readonly" placeholder="Amount">
                    </td>
                    
                    <td width="15%">
                      <input type="number" name="total_cost[]" class="total_cost disabled_fields form-control text-center" value="0.00" readonly="readonly" />
                    </td>
                    <td align="right" width="10%">
                        <button type="button" class="btn btn-default pull-right add_product_in_invoice" aria-label="Add Item">
                          <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                        </button>

                        <button type="button" class="hide btn btn-default pull-left remove_product_in_invoice" aria-label="Remove Item">
                          <span class="glyphicon glyphicon-minus" aria-hidden="true"></span>
                        </button>
                    </td>
              </tr>
            </table>

            <br />
            <hr />

            <div class="row">
              <div class="col-md-4 col-md-offset-8">
                <div class="col-md-12">
                  <table>
                    <tr>
                      <td width="50%"><h4><strong>Sub Total</strong></h4></td>
                      <td width="50%"><h4 class="subTotal text-right text-danger">0.00</h4></td>
                    </tr>
                    <tr>
                      <td><h4><strong>CGST</strong>&nbsp;<span class="cgst_selected text-right text-danger">0%</span></h4></td>
                      <td><h4 class="how_much_cgst text-right text-danger">0.00</h4></td>
                    </tr>
                    <tr>
                      <td><h4><strong>SGST</strong>&nbsp;<span class="sgst_selected text-right text-danger">0%</span></h4></td>
                      <td><h4 class="how_much_sgst text-right text-danger">0.00</h4></td>
                    </tr>
                    <tr>
                      <td colspan="2"><hr></td>
                    </tr>
                    <tr>
                      <td><h4><strong>Total</strong></h4></td>
                      <td><input type="text" readonly="readonly" name="invoice_total" class="final_total text-right text-danger" value="0.00" /></td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
     
      </div><!--end .bs-callout-->

      <div class="bs-callout">
        
        <div class="row">
          <div class="col-md-4">
            <div class="col-md-12">
              <div class="form-group">
                <button id="invoice_preview_btn" type="button" class="btn btn-primary btn-block" tabindex="9">Update preview</button>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="col-md-12">
              <div class="form-group">
                <button id="invoice_submit_btn" type="submit" class="btn btn-primary btn-block" tabindex="10">Save</button>
              </div>
            </div>
          </div>


          <div class="col-md-4">
            <div class="col-md-12">
              <div class="form-group">
                <button id="invoice_download_btn" type="button" class="btn btn-default btn-block" tabindex="11">Download</button>
               </div>
            </div>
          </div>
        </div>


        <div class="row">
          
          <div class="modal fade" tabindex="-1" role="dialog" id="information">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 class="modal-title text-danger">Error</h4>
                </div>
                <div class="modal-body">
                  <p class="message"></p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                </div>
              </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
          </div><!-- /.modal -->


        </div>


      </div>

      </form><!--end form-->

      <div class="bs-callout">
        
        <iframe id="invoice_preview" width="100%" height="500px" type="application/pdf" src="" download></iframe>

      </div>

    </div><!-- /.container -->


    <?php include_once("partials/footer_js.php") ?>
    
  </body>
</html>