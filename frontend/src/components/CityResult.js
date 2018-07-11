// @flow
import React from 'react';

import ReactMapboxGl from 'react-mapbox-gl';

import {
  Card,
  DocumentType,
  SearchDocument,
  SearchResultTitle,
  StarRating,
  Signals,
} from '@attivio/suit';

type CityResultProps = {
  /** The document to be displayed */
  document: SearchDocument;
  /** The document’s position in the search results */
  position: number;
  /** The unique key to use fo the document */
  key: string;
  /**
   * Optional. The location of the node through which to interact with Attivio.
   * Defaults to the value in the configuration.
   */
  baseUri: string;
}

type CityResultDefaultProps = {
  baseUri: string;
}

/**
 * An individual search result for a City document.
 */
export default class CityResult extends React.Component<CityResultDefaultProps, CityResultProps, void> {
  static defaultProps = {
    baseUri: '',
  };

  static displayName = 'CityResult';

  /**
   * Render a city result if the document is in the city table. Otherwise, return null.
   */
  static forDocument(document: SearchDocument, position: number, key2: string): ?React$Element<any> {
    const table = document.getFirstValue('table');
    if (table === 'city') {
      return (
        <CityResult
          document={document}
          position={position}
          key={key2}
        />
      );
    }
    return null; // Let the next function try to render it
  }

  constructor(props: CityResultProps) {
    super(props);
    (this: any).rateDocument = this.rateDocument.bind(this);
  }

  rateDocument(doc: SearchDocument, rating: number) {
    if (doc.signal) {
      new Signals(this.props.baseUri).addSignal(doc, 'like', rating);
    }
  }

  render() {
    const doc = this.props.document;
    const language = doc.getFirstValue('language');
    const location = doc.getFirstValue('location');
    const size = parseInt(doc.getFirstValue('size'), 10);
    const country = doc.getFirstValue('country');
    const latitude = doc.getFirstValue('latitude');
    const longitude = doc.getFirstValue('longitude');

    const Map = ReactMapboxGl.Map({
      accessToken: '',
      attributionControl: false,
    });

    return (
      <Card key={this.props.key} style={{ marginBottom: '5px' }}>
        <div className="row" style={{ width: '100%', margin: 0 }} >
          <div className="col-sm-3 col-xs-4 col-md-3 col-lg-3" style={{ padding: 0 }}>
            <DocumentType docType="city" position={this.props.position} />
          </div>
          <div className="col-sm-9 col-xs-8 col-md-9 col-lg-9">
            <SearchResultTitle doc={doc} baseUri={this.props.baseUri} />
          </div>
        </div>
        <div className="row" style={{ width: '100%', margin: 0 }} >
          <div
            className="col-sm-12 col-xs-12 col-md-12 col-lg-12"
            style={{
              padding: 0,
            }}
          >
            The {size.toLocaleString()} inhabitants here speak {language}.
            This city is in the state/province of {location} in {country}.
          </div>
          <div style={{ border: '1px solid blue' }}>
            <Map
              style="mapbox://styles/mapbox/light-v9" // eslint-disable-line react/style-prop-object
              containerStyle={{
                height: 100,
                width: 100,
              }}
              center={[longitude || 0, latitude || 0]}
              zoom={[1]}
            />
          </div>
          <StarRating onRated={(rating) => { this.rateDocument(doc, rating); }} />
        </div>
      </Card>
    );
  }
}
