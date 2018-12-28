import React from "react";

import { storiesOf } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";

import SimpleFileUploadButton from "./SimpleFileUploadButton";
import FileDndZone from "./FileDndZone";
import AvatarField from "./AvatarField";
import ImageGallery from "./ImageGallery";

const stories = storiesOf("react-butterfiles", module);

stories.addDecorator(withKnobs);

stories.add("Simple file upload button", () => <SimpleFileUploadButton />);
stories.add("File drop zone with drag and drop", () => <FileDndZone />);
stories.add("Avatar field", () => <AvatarField />);
stories.add("Image Gallery", () => <ImageGallery />);