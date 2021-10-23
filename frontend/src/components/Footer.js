import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
    return (
        <footer>
            <Container>
                <Row>
                    <Col className="text-center py-3">
                        All rights reserved &copy; NeonTech
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}
export default Footer