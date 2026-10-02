var createPdf = function(preview){

    /* Code to convert numbers to words for Indian Currency */
    function number2text(value) {
    var fraction = Math.round(frac(value)*100);
    var f_text  = "";

    if(fraction > 0) {
        f_text = "AND "+convert_number(fraction)+" PAISE";
    }

    return convert_number(value)+" RUPEE "+f_text+" ONLY";
    }

    function frac(f) {
        return f % 1;
    }

    function convert_number(number)
    {
        if ((number < 0) || (number > 999999999)) 
        { 
            return "NUMBER OUT OF RANGE!";
        }
        var Gn = Math.floor(number / 10000000);  /* Crore */ 
        number -= Gn * 10000000; 
        var kn = Math.floor(number / 100000);     /* lakhs */ 
        number -= kn * 100000; 
        var Hn = Math.floor(number / 1000);      /* thousand */ 
        number -= Hn * 1000; 
        var Dn = Math.floor(number / 100);       /* Tens (deca) */ 
        number = number % 100;               /* Ones */ 
        var tn= Math.floor(number / 10); 
        var one=Math.floor(number % 10); 
        var res = ""; 

        if (Gn>0) 
        { 
            res += (convert_number(Gn) + " CRORE"); 
        } 
        if (kn>0) 
        { 
                res += (((res=="") ? "" : " ") + 
                convert_number(kn) + " LAKH"); 
        } 
        if (Hn>0) 
        { 
            res += (((res=="") ? "" : " ") +
                convert_number(Hn) + " THOUSAND"); 
        } 

        if (Dn) 
        { 
            res += (((res=="") ? "" : " ") + 
                convert_number(Dn) + " HUNDRED"); 
        } 


        var ones = Array("", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX","SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN","FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN","NINETEEN"); 
    var tens = Array("", "", "TWENTY", "THIRTY", "FOURTY", "FIFTY", "SIXTY","SEVENTY", "EIGHTY", "NINETY"); 

        if (tn>0 || one>0) 
        { 
            if (!(res=="")) 
            { 
                res += " AND "; 
            } 
            if (tn < 2) 
            { 
                res += ones[tn * 10 + one]; 
            } 
            else 
            { 

                res += tens[tn];
                if (one>0) 
                { 
                    res += ("-" + ones[one]); 
                } 
            } 
        }

        if (res=="")
        { 
            res = "zero"; 
        } 
        return res;
    }

    /* End of Code to convert numbers to words for Indian Currency */
	
    var preview = preview;

                agency_name = 'BADRI ENTERPRISES',
                agency_site_url = 'www.Companyenterprises.com',
                footer = agency_name + ' - ' + agency_site_url,

                page_size = 'a4',
                page_width = 220, // mm
                page_margin = 10, // mm
                content_width = page_width - (page_margin * 2) // available width for the content
        ;


    var pdf = new jsPDF('p', 'mm', page_size);

    // Optional - set properties of the document
    pdf.setTextColor(30, 30, 30);
    pdf.setDrawColor(150, 150, 150);
    pdf.setFontSize(12);
    pdf.setProperties({
            title: agency_name,
            subject: footer,
            author: 'me',
            creator: 'Company Enterprises'
    });


    //Initial coordinates
    var x = 10;
    var y = 8;
    pdf.setFontSize(12);
    pdf.text("TAX INVOICE", ((content_width/2)), y);
    y = y + 8;
    pdf.setFontSize(14);
    pdf.setFontType("bold");
	pdf.text(agency_name, x, y);

    y = y + 6;
    pdf.setFontSize(9);
    pdf.setFontType("normal");
    pdf.text(["Shop No. 3, Nirmal Comm. Complex, 168 M.G Road, Camp, Pune - 411001. Ph No: +91 9822677552, +91 9373338852"], x, y);

    y = y + 2;
    pdf.setLineWidth(0.1);
    pdf.line(x, y, content_width, y); // horizontal line
    pdf.line(x, y+0.2, content_width, y); // horizontal line
    pdf.line(x, y+0.2, content_width, y); // horizontal line    
    
    y = y + 6;
	// Get invoice number
	var invoice_number = ($(".invoice_number").val() == "") ? "####" : $(".invoice_number").val();
    var client_name = $(".client_name_selection").children("option:selected").text();
    var client_gst_no = $(".client_gst").val();
    var client_address = $(".client_address").val();

    if(client_gst_no.length>0){
        client_gst_no = "(" + client_gst_no + ")";
    }
    var invoice_date = $(".invoice_date").val();
    pdf.setFontSize(9);
pdf.setFontType("bold");
    pdf.text(client_name + " " + client_gst_no + " ", x, y);

pdf.setFontType("normal");
if(client_address.length > 0){
y = y+5
pdf.text(client_address, x, y);
}



    pdf.text("Invoice #: "+ invoice_number, (content_width/2 + 20), y);
    pdf.text("Invoice Date:" + invoice_date, (content_width/2 + 50), y);
	
    y = y + 4;
    pdf.setLineWidth(0.1);
    pdf.line(x, y, content_width, y); // horizontal line
    pdf.line(x, y+0.2, content_width, y); // horizontal line
    pdf.line(x, y+0.2, content_width, y); // horizontal line

    y = y + 8;

    // Print the items in column format
    var menu = [];
    menu[0] = x;
    pdf.setFontSize(10);
    pdf.text("#", menu[0], y);
    menu[1] = menu[0] + 10
    pdf.text("Item", menu[1], y);
    menu[2] = menu[1] + 70;
    pdf.text("HSN", menu[2], y);
    menu[3] = menu[2] + 25;
    pdf.text("MRP", menu[3], y);
    menu[4] = menu[3] + 22;
    pdf.text("Qty.", menu[4], y);
    menu[5] = menu[4] + 15;
    pdf.text("Rate", menu[5], y);
    menu[6] = menu[5] + 22;
    pdf.text("Amount", menu[6], y);

    y = y + 3;
    pdf.setLineWidth(0.1);
    pdf.line(x, y, content_width, y); // horizontal line
    

    // Print all the items
    // When I click on update preview, loop through the table and find out all the items that are added
    pdf.setFontSize(9);
    var items = [];
    
    $.each($(".invoice_table tr.row_item"), function(item){
        var data = {};
        $.each($(this), function(e){
            data["product"]     = $(this).find(".product").children("option:selected").text();
            data["product_hsn"] = $(this).find(".product_hsn").val();
            data["mrp"]         = $(this).find(".mrp").val();
            data["quantity"]    = $(this).find(".quantity").val();
            data["rate"]        = $(this).find(".rate").val();
            data["total_cost"]  = $(this).find(".total_cost").val();

        });
        items.push(data);
    });
    
    
    $.each(items, function(u){
        sr_no = (u + 1).toString();
        y = y + 5;
        pdf.text(sr_no, menu[0], y);
        pdf.text(items[u].product, menu[1], y);
        pdf.text(items[u].product_hsn, menu[2], y);
        pdf.text(items[u].mrp, menu[3], y);
        pdf.text(items[u].quantity, menu[4], y);
        pdf.text(items[u].rate, menu[5], y);
        pdf.text(items[u].total_cost, menu[6], y);
    });

	if(sr_no == 1){
	y = y + 50;
	}
	if(sr_no == 2){
	y=y+45;
	}
	if(sr_no  == 3){
	y=y+40;
	}
	if(sr_no == 4){
	y=y+35;
	}
	if(sr_no == 5){
	y=y+30;
	}
   
    y = y + 5;
    pdf.setLineWidth(0.2);
    pdf.line(x, y, content_width, y); // horizontal line
    pdf.line(x, y+0.2, content_width, y); // horizontal line
    pdf.line(x, y+0.2, content_width, y); // horizontal line

    y = y + 7;
    var subTotal        = $(".subTotal").text();
    var sgst_selected   = $(".sgst_selected").text();
    var cgst_selected   = $(".cgst_selected").text();
    var how_much_sgst   = $(".how_much_sgst").text();
    var how_much_cgst   = $(".how_much_cgst").text();
    var final_total     = $(".final_total").val();

    pdf.text(["Sub Total :        " + subTotal, "", "CGST (" + cgst_selected + ") :     " + how_much_cgst, "SGST (" + sgst_selected + ") :     " + how_much_sgst, "", "Total :               " + final_total], 152, y);
    
    // pdf.setFontSize(6);
    // pdf.text(["I/We hereby certify that my/our registration certificate under the Maharashtra Value Added Tax Act,",
    //          "2002 is in force on the date on which the sale of the goods specifified in this TAX INVOICE is made",
    //          "by me/us and that the transaction of salecovered by this Tax invoice has been effected by me/us,",
    //          "and is shall be accounted for the turnover of sales while filling of my return and the due Tax, ",
    //          "if any, payable on the sale has been paid of shall be paid"], 10, y);

    pdf.setFontSize(9);
    pdf.text("Subject to Pune Jurisdiction", 10, y);
    pdf.setFontType("bold");
    pdf.text("GSTIN : 27BAFPK5111C1Z9", 60, y);

    pdf.setFontType("normal");

    var inWords = number2text(final_total);

    y = y + 11;
    pdf.setFontSize(9);
    pdf.text("Amount in Words:", 10, y);

    y = y + 4;
    pdf.setFontSize(9);
    var index = inWords.lastIndexOf(" AND ");

    if(index>0){
        var inWordsArray = [inWords.slice(0,index), inWords.slice(index)];
        pdf.text(inWordsArray[0], 10, y);
        y = y + 4;
        pdf.text(inWordsArray[1].trim(), 10, y);
    }else{
        y = y + 4;
        pdf.text(inWords, 10, y);
    }


    y = y + 3;
    pdf.setFontSize(8);
    pdf.setLineWidth(0.2);
    pdf.line(x, y, content_width, y); // horizontal line
    pdf.line(x, y+0.2, content_width, y); // horizontal line
    pdf.line(x, y+0.2, content_width, y); // horizontal line

    //y = y + 4;
    //pdf.text("GSTIN : 27BAFPK5111C1Z9", 10, y);


    //Get details so that we can send file name in the post parameter
    var invoice_no = $("#invoice_number").val();
    var invoice_dt = $("#invoice_date input").val();
    var find = new RegExp("/", "g");
    invoice_dt = invoice_dt.replace(find, '_');

    var filename = invoice_no + "_" + invoice_dt + ".pdf";
        
    if(preview === "preview"){
		
        $('#invoice_preview').attr('src', pdf.output('datauristring'));

	}else if(preview === "save"){
        
        var doc = pdf.output('datauristring');

        var data = new FormData();
        data.append("data", doc);
        data.append("filename", filename);
        
        var xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status !== 200) {
              // handle error
            }
          }
        }

        xhr.open( 'post', './server/upload.php', true ); //Post to php Script to save to server
        xhr.send(data);
        	
	}else if(preview === "download"){
        pdf.save(filename + "_temp" + ".pdf");
    }
	
}

$("#invoice_preview_btn").on("click", function(){
	createPdf("preview");
});

$("#invoice_download_btn").on("click", function(){
    createPdf("download");
});