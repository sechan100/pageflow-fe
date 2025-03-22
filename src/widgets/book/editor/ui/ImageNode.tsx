
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig, LexicalNode,
  NodeKey, SerializedLexicalNode,
  Spread
} from 'lexical';

import { $applyNodeReplacement, DecoratorNode } from 'lexical';
import { LexicalImageDecorator } from './ImageComponent';


export type Position = 'left' | 'right' | 'full';

export type ImagePayload = {
  src: string;
  position?: Position;
  width?: number;
  height?: number;
  caption?: string;
  key?: NodeKey;
}

export interface UpdateImagePayload {
  caption?: string;
  position?: Position;
}


export type SerializedImageNode = Spread<
  {
    src: string;
    width: number;
    height: number;
    caption: string;
    position: Position;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<React.ReactNode> {
  __src: string;
  __width: number;
  __height: number;
  // caption이 빈 문자열 '' 이면 없는 것으로 간주한다.
  __caption: string;
  __position: Position;

  constructor(
    src: string,
    position?: Position,
    width?: number,
    height?: number,
    caption?: string,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__position = position || 'full';
    // width, height validation
    if ((width && width < 100) || (height && height < 100)) {
      throw new Error('Image width and height must be greater than 100px')
    }
    this.__width = width || 100;
    this.__height = height || 100;
    this.__caption = caption || '';
  }

  static getType(): string {
    return 'image'
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__position,
      node.__width,
      node.__height,
      node.__caption,
      node.__key,
    )
  }

  /**
   * lexical이 DOM을 LexicalNode로 변환할 때 사용하는 변환 Map을 반환한다.
   * 
   * 변환 Map의 key는 변환할 DOM 노드의 태그 이름이다.
   * img key라면 img 태그를 만났을 때, priority를 고려하여 conversion 함수를 호출한다.
   */
  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: Node) => ({
        conversion: (domNode: Node): null | DOMConversionOutput => {
          if (domNode instanceof HTMLImageElement) {
            const { alt: caption, src, width, height, dataset } = domNode
            const position = dataset.position as Position;
            const node = $createImageNode({ caption, height, src, width, position })
            return { node }
          }
          return null
        },
        priority: 0,
      }),
    }
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img'); // importDOM에서 받아주는 tag랑 똑같은 tag로 만들어준다.
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__caption);
    element.setAttribute('width', this.__width.toString());
    element.setAttribute('height', this.__height.toString());
    element.setAttribute('data-position', this.__position);
    return { element }
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { height, width, caption, src, position } = serializedNode;
    return $createImageNode({
      caption,
      height,
      src,
      width,
      position,
    })
  }

  exportJSON(): SerializedImageNode {
    return {
      src: this.getSrc(),
      position: this.__position,
      width: this.__width,
      height: this.__height,
      caption: this.__caption,
      type: ImageNode.getType(),
      version: 1,
    }
  }

  getSrc(): string {
    return this.__src;
  }

  setCaption(caption: string | null): void {
    const writable = this.getWritable();
    writable.__caption = caption || '';
  }

  setSize({
    width,
    height,
  }: {
    width: number;
    height: number
  }): void {
    const writable = this.getWritable()
    writable.__width = width
    writable.__height = height
  }

  getPosition(): Position {
    return this.__position;
  }

  setPosition(position: Position): void {
    const writable = this.getWritable();
    writable.__position = position;
  }

  update(payload: UpdateImagePayload): void {
    const writable = this.getWritable();
    const { caption, position } = payload;
    if (caption !== undefined) {
      writable.__caption = caption;
    }
    if (position !== undefined) {
      writable.__position = position;
    }
  }

  // View

  override createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span')
    const theme = config.theme
    const className = `${theme.image} image-position-${this.__position}`
    if (className !== undefined) {
      span.className = className
    }
    return span
  }

  override updateDOM(prevNode: ImageNode, dom: HTMLElement, config: EditorConfig): false {
    const position = this.__position
    if (position !== prevNode.__position) {
      const className = `${config.theme.image} image-position-${position}`
      if (className !== undefined) {
        dom.className = className
      }
    }
    return false
  }

  override decorate(): React.ReactNode {
    return (
      <LexicalImageDecorator
        src={this.__src}
        width={this.__width}
        height={this.__height}
        nodeKey={this.getKey()}
        caption={this.__caption}
        position={this.__position}
      />
    )
  }
}

export const $createImageNode = (payload: ImagePayload): ImageNode => {
  return $applyNodeReplacement(
    new ImageNode(
      payload.src,
      payload.position,
      payload.width,
      payload.height,
      payload.caption,
      payload.key,
    ),
  )
}

export const $isImageNode = (
  node: LexicalNode | null | undefined,
): node is ImageNode => {
  return node instanceof ImageNode
}
