var React = require('react');

var DefaultFooter = React.createClass({
    getInitialState: function () {
        var totalPages = this.computePage(this.props.totalCount, this.props.resultsPerPage);
        return ({
            totalPages: totalPages
        })
    },
    handleOnChange: function (event) {
        var resultsPerPage = parseInt(event.target.value);
        this.props.onChangeGrid(null, {
            resultsPerPage: resultsPerPage,
            currentPage:1
        });
    },
    handleOnChangePage: function (event) {
        event.preventDefault();
        var currentPage = parseInt(event.target.id)
        this.props.onChangeGrid(null, {
            currentPage: currentPage
        });
    },
    handleNextClick: function (event) {
        event.preventDefault();
        if (this.props.currentPage < this.state.totalPages) {
            this.props.onChangeGrid(event, {
                currentPage: this.props.currentPage + 1
            });
        }
    },
    handlePreviousClick: function (event) {
        event.preventDefault();
        if (this.props.currentPage > 1) {
            this.props.onChangeGrid(event, {
                currentPage: this.props.currentPage - 1
            });
        }
    },
    componentWillReceiveProps: function(nextProps) {
        var totalPages = this.computePage(nextProps.totalCount, nextProps.resultsPerPage);
        this.setState({
            totalPages: totalPages
        });
    },
    computePage: function(totalCount, resultsPerPage){
        var totalPages = Math.floor(totalCount / resultsPerPage);
        if (totalCount % resultsPerPage !== 0) {
            totalPages++;
        }
        return totalPages;
    },
    render: function () {
        var optionsArray = [];
        var arr = [10,20,50,100,200,300,400];
        for (var i = 0; i < arr.length; i++) {
            let selected = this.props.resultsPerPage===arr[i]?true:false;
            optionsArray.push(<option key={arr[i]} value={arr[i]} selected={selected}>{arr[i]}</option>);
        }
        var pageArr=[];
        for(var i=1;i<=Math.ceil(this.props.totalCount/this.props.resultsPerPage);i++){
            let selected = this.props.currentPage===i?true:false;
            pageArr.push(<li onClick={this.handleOnChangePage} key={i} id={i} selected={selected}><a href="#" id={i}>{i}</a></li>);
        }
        return (
            <div className='defaultFooter'>
{/*                <div className="pagination pull-left">
                    Rows per page : <select onChange={this.handleOnChange}>{optionsArray}</select>
                </div>*/}
                <div className="row table-info-bot-wrap">
                    <div className="col-lg-4 col-md-12 col-xs-12">
                        {this.props.totalCount>0 && this.props.resultsOnPage>0? ((this.props.currentPage - 1) * this.props.resultsPerPage + 1):0}&nbsp;
                        to {(this.props.currentPage - 1) * this.props.resultsPerPage + this.props.resultsOnPage}&nbsp;
                        of {this.props.totalCount} rows &nbsp;&nbsp;&nbsp;</div>
                    <div className="col-lg-8 col-md-12 col-xs-12 table-pagination">
                    <ul className="pagination">
                        <li>
                            <a href="#" onClick={this.handlePreviousClick} aria-label="Previous">
                                <span aria-hidden="true">
                                    <i className="fa fa-caret-left"></i><b>Prev</b>
                                </span>
                            </a>
                        </li>
                        {pageArr}
                        <li>
                            <a href="#" aria-label="Next" onClick={this.handleNextClick}>
                                <span aria-hidden="true"><b>Next</b>
                                    <i className="fa fa-caret-right"></i>
                                </span>
                            </a>
                        </li>
                    </ul>
                    </div>
                </div>
                <div style={{clear:'both'}}></div>
            </div>
        )
    }
});

module.exports = DefaultFooter;
