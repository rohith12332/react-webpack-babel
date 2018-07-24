import React, { Component } from 'react'
import jsPDF from 'jspdf';

export default class TableAction extends Component {
  makePDF = () => {
    var quotes = document.getElementById('wareHouseOrderTablePDF');
    html2canvas(quotes, {
      onrendered: function(canvas) {
        var contentWidth = canvas.width;
        var contentHeight = canvas.height;

        //The height of the canvas which one pdf page can show;
        var pageHeight = contentWidth / 592.28 * 841.89;
        console.log(pageHeight);
        //return false;
        //the height of canvas that haven't render to pdf
        var leftHeight = contentHeight;
        //addImage y-axial offset
        var position = 0;
        //a4 format [595.28,841.89]
        var imgWidth = 595.28;
        var imgHeight = 592.28 / contentWidth * contentHeight;

        var pageData = canvas.toDataURL('image/png', 1.0);

        var pdf = new jsPDF('', 'pt', 'a4');
        pdf.page = 1;

        function footer() {
          pdf.text(150, 285, 'page ' + pdf.page);
          pdf.page++;
        };

        if (leftHeight < pageHeight) {
          pdf.addImage(pageData, 'PNG', 0, 0, imgWidth, imgHeight);
        } else {
          while (leftHeight > 0) {
            pdf.addImage(pageData, 'PNG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight;
            position -= 841.89;
            //avoid blank page
            if (leftHeight > 0) {
              pdf.addPage();
              //footer()
            }
          }
        }

        pdf.save('wareHouseOrderTable.pdf');
      }
    })
  }
  render() {
    return (
      <table className="table table-hover">
        <tr>
          <td style={{ textAlign: 'right' }}>
            <button
              style={{ marginLeft: 0 }}
              type="submit"
              className="btn btn-primary md-trigger"
              data-modal="full-success"
              //disabled={!this.canSubmit}
              onClick={this.onSubmit}>
              <i className="fa fa-floppy-o"></i> Save All
            </button>&nbsp;&nbsp;&nbsp;
            <button
              style={{ marginLeft: 0 }}
              type="submit"
              className="btn btn-primary md-trigger"
              data-modal="full-success"
              onClick={this.makePDF}>
              <i className="fa fa-file-pdf-o"></i> Download PDF
            </button>
          </td>
        </tr>
      </table>
    )
  }
}
