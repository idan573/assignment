import * as React from 'react';
import { MESSAGE_CONTENT_TYPES } from '@bit/scalez.savvy-ui.task-message';
import { Button } from '@bit/scalez.savvy-ui.button';
import { getDate } from '@bit/scalez.savvy-ui.utils';
import { savvyLogo } from '@bit/scalez.savvy-ui.svg';

/* Types */
import {
  Stylist,
  ThreadEvent,
  THREAD_EVENT_TYPES,
  THREAD_EVENT_SENDER_TYPES
} from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import {
  StyledThreadReferenceImage,
  StyledThreadReferenceEventItem,
  StyledChatWithStylistMessage
} from './styles';

interface Props extends ThreadEvent {
  stylist?: Stylist;
  onReferenceEventClick?: (threadIdReference: string) => void;
}

const ChatWithStylistMessage = React.memo(
  React.forwardRef<HTMLDivElement, Props>(
    (
      {
        timestamp,
        threadEventType,
        senderType,
        text,
        images = [],
        video,
        image,
        taskName,
        threadIdReference,
        title,
        stylist: stylistData = {},
        onReferenceEventClick
      }: Props,
      ref: React.Ref<HTMLDivElement>
    ) => {
      const {
        state: { userData }
      } = React.useContext<RootContextType>(RootContext);

      const timestampString = React.useMemo(() => {
        const { day, month, year } = getDate(timestamp);
        return `${day} ${month.toUpperCase()} ${year}`;
      }, []);

      const taskDisplayNameString = React.useMemo(() => {
        if (threadEventType !== THREAD_EVENT_TYPES.THREAD_REFERENCE) {
          return '';
        }

        return title;
      }, []);

      const messageInfo = React.useMemo(() => {
        switch (senderType) {
          case THREAD_EVENT_SENDER_TYPES.USER:
            return {
              isSender: true,
              senderImage: userData.profilePicture,
              senderName: userData.firstName,
              timestamp: timestampString
            };
          case THREAD_EVENT_SENDER_TYPES.STYLIST:
            return {
              senderImage: stylistData.profilePicture,
              senderName: stylistData.firstName || 'Your stylist',
              timestamp: timestampString
            };
          case THREAD_EVENT_SENDER_TYPES.SAVVY:
            return {
              senderImage: savvyLogo({ scale: 0.45 }),
              senderName: 'Savvy',
              timestamp: timestampString
            };

          default:
            return {
              senderImage: '',
              senderName: '',
              timestamp: ''
            };
        }
      }, [stylistData]);

      const messageContent = React.useMemo(() => {
        switch (threadEventType) {
          case THREAD_EVENT_TYPES.MESSAGE:
            return [
              !!text && {
                type: MESSAGE_CONTENT_TYPES.TEXT,
                data: text
              },
              !!images.length && {
                type: MESSAGE_CONTENT_TYPES.PHOTO,
                data: images
              },
              !!video && {
                type: MESSAGE_CONTENT_TYPES.VIDEO,
                data: video
              }
            ];
          case THREAD_EVENT_TYPES.THREAD_REFERENCE:
            return [
              {
                type: MESSAGE_CONTENT_TYPES.CUSTOM,
                children: (
                  <StyledThreadReferenceEventItem>
                    <p className="sbody">
                      {senderType === THREAD_EVENT_SENDER_TYPES.USER
                        ? `${userData.firstName} requested "${title}"`
                        : `${stylistData.firstName} responded on "${title}"`}
                    </p>

                    <hr />

                    <div
                      className="task-block"
                      onClick={() => onReferenceEventClick?.(threadIdReference)}
                    >
                      <StyledThreadReferenceImage src={image} />

                      <p className="sbody-bold">{taskDisplayNameString}</p>

                      <Button
                        data-type="primary"
                        data-size="extra-small"
                        data-action="next"
                        data-form="circle"
                        data-action-position="center"
                      />
                    </div>
                  </StyledThreadReferenceEventItem>
                )
              }
            ];
          default:
            return [];
        }
      }, []);

      /* Mark old stylist's messages with different color */
      const isOldStylistMessage =
        senderType === THREAD_EVENT_SENDER_TYPES.STYLIST &&
        stylistData.stylistId !== userData.homePageStylist;

      return (
        <StyledChatWithStylistMessage
          ref={ref}
          info={messageInfo}
          content={messageContent}
          data-is-old-stylist={isOldStylistMessage}
        />
      );
    }
  )
);

export { ChatWithStylistMessage };
