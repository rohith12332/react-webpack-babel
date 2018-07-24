import React from 'react';
//import styles from './Product.css';
class ImageUpload2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {file: '',imagePreviewUrl: ''};
  }

  _handleSubmit(e) {
    e.preventDefault();
    //console.log('handle uploading-', this.state.file);
  }


  _handleImageRemove(e){
    e.preventDefault();
      this.setState({
        file:'',
        imagePreviewUrl: null
      });
      this.props.getPreview2(null);
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }
    reader.onload = () => {
      this.props.getPreview2(reader.result);
    }
    reader.readAsDataURL(file)
  }

  render() {
    const {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl ==''){
        var imagePreviewUrl2 = this.props.getImage;
        $imagePreview = (<img src={imagePreviewUrl2} />);
    }else{
      $imagePreview = (<img src={imagePreviewUrl} />);
    } 
    return (
      <div className="widget widget-small">
        <div className="row">
          <div className="col-sm-6">
            <div className="product-widget-head"></div>
            {this.props.title && <div className="product-widget-head">{this.props.title}</div>}
          </div>
          <div className="col-sm-6">
            <div className="fileContainer sprite"> <span><i className="icon icon-1197"></i> Upload Image</span>
              <form onSubmit={(e)=>this._handleSubmit(e)}>
                <input className="fileInput" type="file" onChange={(e)=>this._handleImageChange(e)} />
              </form>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">            
            <div id="logoContainer" className="logoContainer--preview">{$imagePreview}</div>
            <a onClick={(e)=>this._handleImageRemove(e)}><i className="icon icon-1089"></i></a>
          </div>
        </div>
      </div>
    )
  }
}
export default ImageUpload2;