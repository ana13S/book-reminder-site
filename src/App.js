import React from 'react';
import './App.css';
import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookList: null
    };
    this.updateSorting = this.updateSorting.bind(this);
  }

  componentDidMount() {
    fetch('http://book-reminder-api-tancred.us-west-1.elasticbeanstalk.com/book-reminder')
      .then(response => response.json())
      .then(bookList => this.setState({ bookList }));
  }

  renderBookItem(index) {
    return (
      <BookItem key={"book" + index} book={this.state.bookList[index]} index={index} />
    );
  }

  renderAllBookItems() {
    if (!this.state.bookList)
      return null;
    else {
      return (<div className="book-area"><Accordion defaultActiveKey="0">
        {[...Array(this.state.bookList.length).keys()].map(index => this.renderBookItem(index))}
      </Accordion>
      </div>
      );
    }
  }

  updateSorting(type) {
    var list = JSON.parse(JSON.stringify(this.state.bookList));
    switch (type) {
      case "Title":
        list = list.sort((a, b) => (a.title > b.title) ? 1 : -1);
        break;
      case "Author":
        list = list.sort((a, b) => (a.author > b.author) ? 1 : -1);
        break;
      case "Decreasing Priority":
        list = list.sort((a, b) => (a.priorityLevel < b.priorityLevel) ? 1 : -1);
        break;
      case "Increasing Number of Pages":
        list = list.sort((a, b) => (a.pages > b.pages) ? 1 : -1);
        break;
      default:
        list = [];
    }
    this.setState({ bookList: list });
  }

  render() {
    return (<div>
      <div className="sorting-bar">
      <SortingBar updateSorting={this.updateSorting} />
      </div>
      
      {this.renderAllBookItems()}
    </div>);
  }
}

class SortingBar extends React.Component {
  sortingOptions = ["Title", "Author", "Decreasing Priority", "Increasing Number of Pages"];

  renderSortingOption(str) {
    return (
      <Dropdown.Item className="dropdownbox" onClick={() => this.props.updateSorting(str)} key={str}>{str}</Dropdown.Item>
    );
  }

  render() {
    return (
      <DropdownButton className="dropdownbox" id="dropdown-basic-button" title="Sort By" variant="danger">
        {this.sortingOptions.map((str) => this.renderSortingOption(str))}
      </DropdownButton>
    );
  }

}

class BookItem extends React.Component {
  render() {
    return (
      <div>
        <Card className="card">
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey={this.props.index.toString()}>
              {this.props.book.title}
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey={this.props.index.toString()}>
            <Card.Body>Author: {this.props.book.author}
              <br />Number of Pages: {this.props.book.pages}
              <br />Started? {this.props.book.started.toString() ? "Yes" : "No"}
              <br />Priority Level: {this.props.book.priorityLevel}</Card.Body>
          </Accordion.Collapse>
        </Card>
      </div>
    )
  }
}

export default App;
