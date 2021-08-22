import * as React from 'react';
import { Button } from '@bit/scalez.savvy-ui.button';
import {
  Header,
  HEADER_ITEM_TYPES,
  HEADER_ITEM_TEMPLATE_TYPES,
  HEADER_ITEM_POSITION_TYPES
} from '@bit/scalez.savvy-ui.header';

/* Styles */
import { StyledVideoPreviewOverlay } from './styles';

interface Props {
  render: boolean;
  file: File;
  acceptVideo: () => void;
  deleteVideo: () => void;
}

const transition = {
  from: { opacity: 0 },
  enter: { opacity: 1 },
  leave: { opacity: 0 }
};

const VideoPreviewOverlay: React.FC<Props> = React.memo(
  ({ render, file, acceptVideo, deleteVideo }: Props) => {
    const headerContent = React.useMemo(
      () => [
        {
          type: HEADER_ITEM_TYPES.BUTTON,
          props: {
            ['data-action']: 'back' as const,
            dataGridTemplate: HEADER_ITEM_TEMPLATE_TYPES.MAX_CONTENT,
            onClick: deleteVideo
          }
        },
        {
          type: HEADER_ITEM_TYPES.CUSTOM,
          props: {
            dataSelfPosition: HEADER_ITEM_POSITION_TYPES.CENTER
          },
          render: () => (
            <>
              <h4>Record a Video Response</h4>
              <p>Video must be no longer than 1 minute</p>
            </>
          )
        }
      ],
      []
    );

    return (
      <StyledVideoPreviewOverlay render={render} transition={transition}>
        <Header content={headerContent} />

        <div className="video-wrapper">
          <video controls src={!!file ? URL.createObjectURL(file) : undefined}>
            <source type="video/mp4" />
            Sorry, your browser doesn't support HTML5 video.
          </video>
        </div>

        <div className="buttons-wrapper">
          <Button
            data-type="secondary"
            data-action="trash"
            data-size="small"
            onClick={deleteVideo}
          >
            Delete
          </Button>

          <Button
            data-type="primary"
            data-action="upload"
            data-size="small"
            onClick={acceptVideo}
          >
            Upload
          </Button>
        </div>
      </StyledVideoPreviewOverlay>
    );
  }
);

export { VideoPreviewOverlay };
