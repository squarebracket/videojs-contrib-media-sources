/**
 * @file create-text-tracks-if-necessary.js
 */
import {removeExistingTrack} from './cleanup-text-tracks';

/**
 * Create text tracks on video.js if they exist on a segment.
 *
 * @param {Object} sourceBuffer the VSB or FSB
 * @param {Object} mediaSource the HTML or Flash media source
 * @param {Object} segment the segment that may contain the text track
 * @private
 */
const createTextTracksIfNecessary = function(sourceBuffer, mediaSource, segment) {
  const player = mediaSource.player_;

  // create an in-band caption track if one is present in the segment
  if (segment.captions &&
      segment.captions.length) {
    if (!sourceBuffer.inbandTextTracks_) {
      sourceBuffer.inbandTextTracks_ = {};
    }
    segment.captions.forEach(function(caption) {
      // Support older mux.js which only supports CC1
      let track = caption.stream || 'CC1';

      if (!sourceBuffer.inbandTextTracks_[track]) {
        removeExistingTrack(player, 'captions', track);
        sourceBuffer.inbandTextTracks_[track] = player.addRemoteTextTrack({
          kind: 'captions',
          label: track
        }, false).track;
      }
    });
  }

  if (segment.metadata &&
      segment.metadata.length &&
      !sourceBuffer.metadataTrack_) {
    removeExistingTrack(player, 'metadata', 'Timed Metadata', true);
    sourceBuffer.metadataTrack_ = player.addRemoteTextTrack({
      kind: 'metadata',
      label: 'Timed Metadata'
    }, false).track;
    sourceBuffer.metadataTrack_.inBandMetadataTrackDispatchType =
      segment.metadata.dispatchType;
  }
};

export default createTextTracksIfNecessary;
