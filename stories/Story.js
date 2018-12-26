// @flow
import * as React from "react";
type Props = {
    children: React.Node
};

import SyntaxHighlighter from "react-syntax-highlighter";

export default ({ children }: Props) => {
    const render = {
        title: null,
        description: null,
        example: null,
        code: null
    };

    React.Children.forEach(children, child => {
        render[child.type] = child.props.children;
    });

    return (
        <div>
            <h1>{render.title}</h1>
            <div>{render.description}</div>
            <div>
                <h2>Example</h2>
                {render.example}
            </div>
            <div>
                <h2>Code</h2>
                <SyntaxHighlighter>{render.code}</SyntaxHighlighter>
            </div>
        </div>
    );
};
