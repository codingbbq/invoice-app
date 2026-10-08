$(function () {
    $('#invoice_date').datetimepicker({
        format: 'DD/MM/YYYY',
    	  showClose: true,
        defaultDate: new Date()
    });


    // All the calculation to be done here for Invoice
    var vat_applied         = $("#vat_applied");
    var sgst_selected       = $(".sgst_selected");
    var cgst_selected       = $(".cgst_selected");
    var discount_applied    = $(".discount_applied");


    // VAT Related information
    vat_applied.on("change", function(){

      var gst_selected = $(this).val();

      $(".invoice_table").find(".vat_bifercation").each(function(){
            $(this).val(gst_selected).trigger("change");
      });

    	if(gst_selected > 0){
	     	sgst_selected.removeClass("text-danger").addClass("text-primary").text((gst_selected/2) + "%");
        cgst_selected.removeClass("text-danger").addClass("text-primary").text((gst_selected/2) + "%");
    	}else{
    		sgst_selected.removeClass("text-primary").addClass("text-danger").text(0 + "%");
        cgst_selected.removeClass("text-primary").addClass("text-danger").text(0 + "%");
    	}

    	update_totalCost();
    });

    // Discount realted information
    discount_applied.on("change", function(){
        var discount = $(this).val();
        $(".invoice_table").find(".discount").each(function(){
            $(this).val(discount).trigger("change");
        });
    });


    var update_totalCost = function(){
    	// Find all the tr.row_items and find the total cost. Add all the items
    	var sum = 0;
    	$(".invoice_table").find(".total_cost").each(function(){
    		sum = sum + parseFloat($(this).val());
    	});

    	//Calculate VAT and do a final Total
    	var final_sum = (Math.round(sum*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
    	var vat = $("#vat_applied").val();


      var how_much_vat = ((vat/100)*sum);
      how_much_vat = (Math.round(how_much_vat*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
      var how_much_sgst = how_much_vat/2;
      var how_much_cgst = how_much_vat/2;

    	var total = (((vat/100)*sum) + sum);
      var total_rounded = (Math.round(total*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
      $(".how_much_sgst").text(how_much_sgst);
      $(".how_much_cgst").text(how_much_cgst);
    	$(".subTotal").text(final_sum);
    	$(".final_total").val(total_rounded);
    }


    // On change of any input items in a row, we calculate the total cost.
    $(".invoice_table").on("change select", "input", function(){
        var entire_row = $(this).closest("tr");
        var quantity =  entire_row.find("#quantity").val();
        var mrp = entire_row.find("#mrp").val();
        var discount = $(".discount").val();
        var rate_final = mrp - (mrp * discount/100);

        //Remove VAT from the product
        var what_gst = $(".vat_bifercation").val();
        if(what_gst == "12.0"){
          what_gst = 10.72;
        }
        if(what_gst == "18.0"){
          what_gst = 15.25;
        }
        if(what_gst == "28.0"){
          what_gst = 21.875;
        }

        rate_final = rate_final - (rate_final * what_gst/100);

        var total_cost =  parseFloat(quantity * rate_final);
        entire_row.find(".rate").val((Math.round(rate_final*Math.pow(10,2))/Math.pow(10,2)).toFixed(2));
        entire_row.find(".total_cost").val((Math.round(total_cost*Math.pow(10,2))/Math.pow(10,2)).toFixed(2));
        update_totalCost();
    });

    // On click of add button, clone the row for new items to be added in the invoice.
    $(".invoice_table").on("click", ".add_product_in_invoice", function(){

      // Find the highest row array element
      var array_item = 0, temp = 0;
      $(".row_item").each(function(){
        name = $(this).find("input").attr("name");
        var temp = name.match(/\d+/);
        if(temp > array_item){
          array_item = temp;
        }
      });

      var clone = $(this).closest("tr.row_item").clone();

    	clone.find("input").val(0);
    	clone.find("input.total_cost").val("0.00");
    	clone.find(".remove_product_in_invoice").removeClass("hide").addClass("show");
    	$(".invoice_table").append(clone);
    	update_totalCost();

    });


    // On click of Remove button, Remove the cloned Row.
    $(".invoice_table").on("click", ".remove_product_in_invoice", function(){
    	$(this).closest("tr").remove();
    	update_totalCost();
    });

    //Show Error 

    var showError = function(message){
      var message = message || "Please resolve all the errrors before proceeding";
      $("#information .message").text(message);
      $('#information').modal({
        keyboard: false
      }).on("shown.bs.modal", function(){
        
        window.setTimeout(function(){
          $("#information").modal("hide");
        }, 2000);
        
      }).on("hidden.bs.modal", function(){
          $("body").animate({ scrollTop : 0}, "fast");
      });

    }

  // On change of products dropdown, update the MRP and HSN Code  
  $(".invoice_table").on("change", ".product", function(){
    
    var thisModule = $(this);
    var product_id = thisModule.val();

    $.ajax({
       url: 'server/dbInformation.php?get_product_mrp=true&get_product_hsn=true&product_id=' + product_id,
       data: {
          format: 'json'
       },
       type: 'GET',
       dataType: 'json',
       error: function(e) {
          console.log(e);
       },
       
       success: function(data) {
          thisModule.closest(".row_item").find(".mrp").val(Number(data.product_mrp)).trigger("change");
          thisModule.closest(".row_item").find(".product_hsn").val(Number(data.product_hsn)).trigger("change");
       }
       
    });

  });

  // On change of client name, update the client GST no.
  $(".client_name_selection").on("change", function(){
    var thisModule = $(this);
    var client_id = thisModule.val();

    $.ajax({
       url: 'server/dbInformation.php?get_client_gst=true&client_id=' + client_id,
       data: {
          format: 'json'
       },
       type: 'GET',
       dataType: 'json',
       error: function(e) {
          console.log(e);
       },
       
       success: function(data) {
          $(".client_gst").val(data.client_gst_no);
          $(".client_address").val(data.client_address);
       }
       
    });

  });

  // Insert Invoice Details in db
  var form_invoice = $("#form_invoice");
  if(form_invoice.length > 0){
        // Show the loading message
        $(".loading").show();

        // First get the invoice number from DB, it should be one number greater than existing number?
        $.ajax({
           url: 'server/dbInformation.php?get_invoice_number=true',
           data: {
              format: 'json'
           },
           type: 'GET',
           dataType: 'json',
           error: function(e) {
              console.log(e);
           },
           
           success: function(data) {
              $(".invoice_number").val(Number(data.invoice_number) + 1);
           }
           
        });

       // Wait for form submit to happen
        $(form_invoice).on("submit", function(event){
            event.preventDefault();

            // Do validation here..

            var allow = form_validation(form_invoice);
            if(allow){
                
                var data = $( this ).serialize();
                
                $.ajax({
                   url: 'server/dbInformation.php?invoice_database=true',
                   data: data,
                   type: 'POST',
                   dataType: 'json',

                   error: function(data) {
                      showError(data);
                   },
                   
                   success: function(data) {
                      
                      if(data.success){

                        // Save the PDF file
                        createPdf("save");
                        
                        // Show the notification and reset the form
                        $("#information .message").text(data.success);
                        $("#information .modal-title").removeClass("text-danger").addClass("text-success").text("Success");
                        $("#information button").removeClass("btn-danger").addClass("btn-success");
                        $('#information').modal({
                          keyboard: true
                        });

                      }
                   }
                   
                });

            }else{
              showError();
            } // End allow

        });

    } // End if statement

// View products page
var viewProductsFn = function(){

    var view_products = $(".view_products");
    var invoice_page  = $(".invoice_page");
    if(view_products.length > 0 || invoice_page.length > 0){
        // Show the loading message
        $(".loading").show();

        $.ajax({
           url: 'server/dbInformation.php?view_products=true',
           data: {
              format: 'json'
           },
           type: 'GET',
           dataType: 'json',
           error: function(e) {
              console.log(e);
           },
           
           success: function(data) {
              
              $(".loading").remove();

              // View products page
              if(view_products.length > 0){
                var html = "";
                $.each(data, function(i, item){
                  var edit_button     = "<a href='add_products.php?productEdit=true&product_id=" + item.product_id + "' class='btn btn-default'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span> Edit</a>";
                  var delete_button   = "<a href='#' data-delete='" + item.product_id + "' class='btn btn-default product_delete'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span> Delete</a>";
                  html += "<tr><td>" +  ++i + "</td><td>" + item.product_name + "</td><td>" + item.product_hsn_code + "</td><td>" + item.product_description + "</td><td><i class='fa fa-inr' aria-hidden='true'></i> " + item.product_mrp + "</td><td>" + edit_button + " " + delete_button + "</td></tr>";
                });

                view_products.find("tr:gt(0)").remove();
                view_products.find("tr:first").after(html);

              }

              if(invoice_page.length > 0){
                var html = "";
                $.each(data, function(i, item){
                  html += "<option value=" + item.product_id + ">" + item.product_name + "</option>";
                });

                invoice_page.find(".product").append(html);
              }

              // Invoice page

           }
           
        });


        
    } // End if statement

} // End viewProductsFn

viewProductsFn();

var delete_items = function(what_to_delete, itemId_to_delete){

  $('#confirm')
      .modal({ 
          backdrop: 'static', 
          keyboard: false 
      })
      .one('click', '.delete', function() {
        // Once you click on the delete button, call a ajax query, delete the item and on success refresh the grid?

        $.ajax({
           url: 'server/dbInformation.php?'+ what_to_delete +'=true&id=' + itemId_to_delete,
           data: {
              format: 'json'
           },
           type: 'GET',
           dataType: 'json',
           error: function(e) {
              console.log(e);
           },
           
           success: function(data) {
              // Run the view products function again to refresh the screen
              if(what_to_delete == "delete_client"){
                viewClientsFn();  
              }else{
                viewProductsFn();
              }
              
              $("#confirm").modal("hide");
           }

          });
         
      }); // end ajax

}

// Delete the product on click of delete button
$(".view_products").on("click", ".product_delete", function(e){
  e.preventDefault();
  var itemId_to_delete = $(this).data().delete;
   
  delete_items("delete_product", itemId_to_delete);

});


var form_validation = function(formObject){
  // after getting the entire form, look for all the form fields that has class required

  var allow = true;
  formObject.find(".required").each(function(){
    var formgroup = $(this);
    formgroup.removeClass("has-error");
    formgroup.find(".form-control-feedback").addClass("hide");
    if($(this).find("input").val() == "" || $(this).find("input").val() <= 0 || $(this).find("select").val() == ""){
      formgroup.addClass("has-error");
      formgroup.find(".form-control-feedback").removeClass("hide");
      allow = false;
    }
    
  });

  if(allow){
    return true;
  }else{
    return false;
  }
  
};


// Add products page
    var add_products = $(".add_products");
    if(add_products.length > 0){

        // Wait for form submit to happen
        var thisForm = $(".form_add_products");
        $(".form_add_products").on("submit", function(event){

            event.preventDefault();

            var allow = form_validation(thisForm);
            if(allow){
            
              var data = $( this ).serialize();

              $.ajax({
                 url: 'server/dbInformation.php?add_products=true',
                 data: data,
                 type: 'POST',
                 dataType: 'json',

                 error: function(data) {
                    $(".alert").removeClass("hide").addClass("alert-warning").find(".alert-text").text(data.error);
                 },
                 
                 success: function(data) {
                    if(data.success){
                      // Show the notification and reset the form
                      $(".alert").removeClass("hide").addClass("alert-success").find(".alert-text").text(data.success);
                      //thisForm.trigger("reset");
                    }
                    if(data.reset){
                      thisForm.trigger("reset"); 
                    }
                 }
                 
              });

            } // End allow condition

        });
        
        

    } // End if statement

  // Add clients page
  var add_clients = $(".add_clients");
  if(add_clients.length > 0){
      
    // Wait for form submit to happen
        var thisForm = $(".form_add_clients");
        $(".form_add_clients").on("submit", function(event){
            
            event.preventDefault();

            var allow = form_validation(thisForm);
            if(allow){

                var data = $( this ).serialize();

                $.ajax({
                   url: 'server/dbInformation.php?add_clients=true',
                   data: data,
                   type: 'POST',
                   dataType: 'json',

                   error: function(data) {
                      $(".alert").removeClass("hide").addClass("alert-warning").find(".alert-text").text(data.error);
                   },
                   
                   success: function(data) {
                      if(data.success){
                        // Show the notification and reset the form
                        $(".alert").removeClass("hide").addClass("alert-success").find(".alert-text").text(data.success);
                        thisForm.trigger("reset");
                      }
                   }
                   
                });
                
            } // End allow          

        });
  }


  // Edit clients page
  var edit_clients = $(".edit_clients");
  if(edit_clients.length > 0){
      
    // Wait for form submit to happen
        var thisForm = $(".form_edit_clients");
        $(".form_edit_clients").on("submit", function(event){
            
            event.preventDefault();

            var allow = form_validation(thisForm);
            if(allow){

                var data = $( this ).serialize();

                $.ajax({
                   url: 'server/dbInformation.php?edit_clients=true',
                   data: data,
                   type: 'POST',
                   dataType: 'json',

                   error: function(data) {
                      $(".alert").removeClass("hide").addClass("alert-warning").find(".alert-text").text(data.error);
                   },
                   
                   success: function(data) {
                      if(data.success){
                        // Show the notification and reset the form
                        $(".alert").removeClass("hide").addClass("alert-success").find(".alert-text").text(data.success);
                        thisForm.trigger("reset");
                      }
                   }
                   
                });
                
            } // End allow          

        });
  }

// View Clients page
var viewClientsFn = function(){

  var view_clients = $(".view_clients");
    var invoice_page  = $(".invoice_page");
    if(view_clients.length > 0 || invoice_page.length > 0){
        // Show the loading message
        $(".loading").show();

        $.ajax({
           url: 'server/dbInformation.php?view_clients=true',
           data: {
              format: 'json'
           },
           type: 'GET',
           dataType: 'json',
           error: function(e) {
              console.log(e);
           },
           
           success: function(data) {
              $(".loading").remove();

              // View products page
              if(view_clients.length > 0){
                var html = "";
                $.each(data, function(i, item){
                  console.log(item);
                  var edit_button     = "<a href='view_clients.php?clientEdit=true&client_id=" + item.client_id + "' class='btn btn-default'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span> View</a>";
                  var delete_button   = "<a href='#' data-delete='" + item.client_id + "' class='btn btn-default client_delete'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span> Delete</a>";
                  html += "<tr><td>" +  ++i + "</td><td>" + item.client_name + "</td><td>" + item.client_gst_no + "</td><td>" + item.client_address + "</td><td>" + item.client_phone + "</td><td>" + item.client_email + "</td><td>" + edit_button + " " + delete_button + "</td></tr>";
                });

                view_clients.find("tr:gt(0)").remove();
                view_clients.find("tr:first").after(html);
              }

              if(invoice_page.length > 0){
                var html = "";
                $.each(data, function(i, item){
                  html += "<option value='" + item.client_id + "'>" + item.client_name + "</option>";
                });

                invoice_page.find(".client_name_selection").append(html);
              }

              // Invoice page

           }
           
        });

    } // End if statement

}

viewClientsFn();

// Delete the Clients on click of delete button
$(".view_clients").on("click", ".client_delete", function(e){
  e.preventDefault();
  var itemId_to_delete = $(this).data().delete;
   
  delete_items("delete_client", itemId_to_delete);

});

// Settings page - view
    var settings = $(".settings");
    if(settings.length > 0){
        // Show the loading message
        $(".loading").show();

        $.ajax({
           url: 'server/dbInformation.php?settings=true',
           data: {
              format: 'json'
           },
           type: 'GET',
           dataType: 'json',
           error: function(e) {
              console.log(e);
           },
           
           success: function(data) {
              
              $(".loading").remove();

              $('input[name="company_name"]').val(data[0].settings_name);
              $('textarea[name="company_address"]').val(data[0].settings_address);
              $('input[name="company_phone"]').val(data[0].settings_phone);
              $('input[name="company_email"]').val(data[0].settings_email);
              $('input[name="company_vat"]').val(data[0].settings_vat);
              $('input[name="company_cst"]').val(data[0].settings_cst);
              
           }
           
        });

    } // End if statement

// Settings page - Update
  var settings = $(".settings");
  if(settings.length > 0){
      
    // Wait for form submit to happen
        var thisForm = $(".form_settings");
        $(".form_settings").on("submit", function(event){
            event.preventDefault();
            var data = $( this ).serialize();

            $.ajax({
               url: 'server/dbInformation.php?update_settings=true',
               data: data,
               type: 'POST',
               dataType: 'json',

               error: function(data) {
                  $(".alert").removeClass("hide").addClass("alert-warning").find(".alert-text").text(data.error);
               },
               
               success: function(data) {
                  if(data.success){
                    // Show the notification and reset the form
                    $(".alert").removeClass("hide").addClass("alert-success").find(".alert-text").text(data.success);
                  }
               }
               
            });

        });
  }


});