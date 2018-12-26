import { text, boolean, array } from "@storybook/addon-knobs";

const defaultAccept = ["application/pdf", "image/jpg", "image/jpeg"];

const defaultToggleProps = {
    multiple: true,
    maxSize: true,
    multipleMaxSize: true,
    accept: true
};

export default (toggleProps = {}) => {
    const { accept, multiple, maxSize, multipleMaxSize } = {
        ...defaultToggleProps,
        ...toggleProps
    };

    const props = {
        accept: accept ? array("accept", defaultAccept) : undefined,
        multiple: multiple ? boolean("multiple", false) : undefined,
        maxSize: maxSize ? text("maxSize", "2mb") : undefined,
        multipleMaxSize: multipleMaxSize ? text("multipleMaxSize", "10mb") : undefined
    };

    props.toString = () => {
        const strings = [];

        multiple && strings.push(`multiple={${props.multiple}}`);
        maxSize && strings.push(`maxSize="${props.maxSize}"`);
        multipleMaxSize && strings.push(`multipleMaxSize="${props.multipleMaxSize}"`);
        accept && strings.push(`accept={${JSON.stringify(defaultAccept)}}`);

        return strings.join(" ");
    };
    return props;
};
