import { ReactElement } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import MarkerClusterer from "@googlemaps/markerclustererplus";
import { MAP_KEY } from "../../config";

const render = (status: Status): ReactElement => {
    if (status === Status.LOADING) return <h3>{status} ..</h3>;
    if (status === Status.FAILURE) return <h3>{status} ...</h3>;
    return null;
};

function Map() {
    return (
        <div>
            <Wrapper apiKey={MAP_KEY} render={render}>
                <MyMapComponent />
            </Wrapper>
            <div style={{ height: "500px" }} id="map"></div>
        </div>
    )
}

const MyMapComponent = (): any => {
    const locations = [
        { lat: 64.0911832, lng: -21.9411208 },
    ];
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 64.0911832, lng: -21.9411208 },
        zoom: 16
    });

    const markers = locations.map((location, i) => {
        return new google.maps.Marker({
            position: location,
            label: "P"
        });
    });

    new MarkerClusterer(map, markers, {
        imagePath:
            "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
    });

    return null;
}

export default Map