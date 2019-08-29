document.addEventListener('DOMContentLoaded', () => {
//test
  const form = document.getElementById('registrar');
  const input = form.querySelector('input');

  const mainDiv = document.querySelector('.main');
  const ul = document.getElementById('invitedList');

  const div = document.createElement('div');
  const filterLabel = document.createElement('label');
  const filterCheckBox = document.createElement('input');

  filterLabel.textContent = "Hide those who haven't responded";
  filterCheckBox.type = 'checkbox';

  div.appendChild(filterLabel);
  div.appendChild(filterCheckBox);

  mainDiv.insertBefore(div, ul);

  // 1. Create a new XMLHttpRequest object
  let xhr = new XMLHttpRequest();

  loadInviteesAsync();

  function loadInviteesAsync() {

    // 2. Configure it: GET-request for the URL /article/.../load
    xhr.open('GET', 'http://localhost:3000/invitees');

    // 3. Send the request over the network
    xhr.send();

    // 4. This will be called after the response is received
    xhr.onload = function() {
      if (xhr.status != 200) { // analyze HTTP status of the response
        alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
      } else { // show the result
        //alert(`Done, got ${xhr.response.length} bytes`); // responseText is the server
        var invitees = JSON.parse(xhr.response);
        for(var i = 0; i < invitees.length; i++) {
          const invitee = invitees[i];
          const li = loadInvitee(invitee.name, invitee.confirmed);

          ul.appendChild(li);
        }
      }
    };
  }

  function removeInviteeAsync(li) {
    const name = li.firstElementChild.textContent;

    xhr.open('DELETE', `http://localhost:3000/invitees/${name}`);

    xhr.send();

    xhr.onload = function() {
      if (xhr.status != 200) { // analyze HTTP status of the response
        alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
      } else { // show the result
        ul.removeChild(li);
      };
    }
  }

  function addInvitee(name) {

    xhr.open('POST', `http://localhost:3000/invitees/`);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(`name=${name}&confirmed=0`);

    xhr.onload = function() {
      if (xhr.status != 201) { // analyze HTTP status of the response
        alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
      } else { // show the result
        const li = createLI(name);
        ul.appendChild(li);
      };
    }
  }

  function editNameAsync(name, li) {
    xhr.open('PUT', `http://localhost:3000/invitees/${name}`);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    const input = li.firstElementChild;
    const newName = input.value;

    const label = li.childNodes[1];
    const checkBox = label.firstElementChild;

    confirmed = (checkBox.checked ? 1 : 0);

    xhr.send(`name=${newName}&confirmed=${confirmed}`);

    xhr.onload = function() {
      if (xhr.status != 200) { // analyze HTTP status of the response
        alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
      } else { // show the result
        const span = document.createElement('span');
        span.textContent = input.value;

        li.insertBefore(span, input);
        li.removeChild(input);
      };
    }
  }

  function editCofirmedAsync(name, checkBox) {
    xhr.open('PUT', `http://localhost:3000/invitees/${name}`);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    confirmed = (checkBox.checked ? 1 : 0);

    xhr.send(`name=${name}&confirmed=${confirmed}`);

    xhr.onload = function() {
      if (xhr.status != 200) { // analyze HTTP status of the response
        alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
      } else { // show the result
        const checked = checkBox.checked;
        const li = checkBox.parentNode.parentNode;

        if(checked) {
          li.className = 'responded';
        } else {
          li.className = '';
        }
      };
    }
  }


  function loadInvitee(name, confirmed) {
    //console.log('createLI', text);

    function createElement(elementName, property, value) {
      const element = document.createElement(elementName);
      element[property] = value;
      return element;
    }

    function appendToLi(elementName, property, value) {
      const element = createElement(elementName, property, value);
      li.appendChild(element);
      return element;
    }

    const li = document.createElement('li');
    const checkBox = createElement('input', 'type', 'checkBox');

    if(confirmed === 1) {
      li.className = "responded";
    }

    checkBox.checked = confirmed;

    appendToLi('span', 'textContent', name);
    appendToLi('label', 'textContent', 'Confirmed')
    .appendChild(checkBox);
    appendToLi('button', 'textContent', 'edit');
    appendToLi('button', 'textContent', 'remove');

    return(li);
  }

  function createLI(text) {
    console.log('createLI', text);

    function createElement(elementName, property, value) {
      const element = document.createElement(elementName);
      element[property] = value;
      return element;
    }

    function appendToLi(elementName, property, value) {
      const element = createElement(elementName, property, value);
      li.appendChild(element);
      return element;
    }

    const li = document.createElement('li');

    appendToLi('span', 'textContent', text);
    appendToLi('label', 'textContent', 'Confirmed')
    .appendChild(createElement('input', 'type', 'checkBox'));
    appendToLi('button', 'textContent', 'edit');
    appendToLi('button', 'textContent', 'remove');

    return(li);
  }

  filterCheckBox.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    const lis = ul.children;
    for(let i = 0; i < lis.length; i++) {
      let li = lis[i]
      if(isChecked === true) {
          if(li.className !== 'responded') {
               li.style.display = 'none';
          } else {
             li.style.display = ''
          }
      } else {
        li.style.display = ''
      }
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value;
    input.value = '';
    addInvitee(text);
  });

  ul.addEventListener('change', (e) => {
    const checkBox = e.target;
    const li = checkBox.parentNode.parentNode;
    const span = li.firstElementChild;

    editCofirmedAsync(span.textContent, checkBox)
  });

  let name = '';

  ul.addEventListener('click', (e) => {
    if(e.target.tagName === 'BUTTON') {
      const button = e.target;
      const li = button.parentNode;
      const action = button.textContent;
      const nameActions = {
        remove: () => {
          removeInviteeAsync(li);
        },
        edit: () => {
          const span = li.firstElementChild;
          const input = document.createElement('input');
          input.type = 'text';
          name = span.textContent;
          input.value = span.textContent;
          li.insertBefore(input, span);
          li.removeChild(span);
          button.textContent = 'save';
        },
        save: () => {
          editNameAsync(name, li);
          button.textContent = 'edit';
        }
      };

      nameActions[action]();
    }
  });
});












//
