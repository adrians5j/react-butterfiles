import * as React from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";

class ImageCropper extends React.Component {
    constructor(props) {
        super(props);
        this.imageRef = null;
        this.cropper = null;
    }

    componentDidMount() {
        this.cropper = new Cropper(this.imageRef, this.props);
    }

    componentWillUnmount() {
        this.cropper && this.cropper.destroy();
    }

    render() {
        return this.props.children({
            cropper: this.cropper,
            getImgProps: props => {
                return {
                    ...props,
                    ref: ref => (this.imageRef = ref)
                };
            },
            getDataURL: () => {
                if (this.cropper) {
                    return this.cropper.getCroppedCanvas().toDataURL();
                }
                return null;
            }
        });
    }
}

export default ImageCropper;
