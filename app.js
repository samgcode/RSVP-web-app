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

  loadInviteesAsync();

  function loadInviteesAsync() {

    // 1. Create a new XMLHttpRequest object
    let xhr = new XMLHttpRequest();

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

    // 1. Create a new XMLHttpRequest object
    let xhr = new XMLHttpRequest();

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
    // 1. Create a new XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    //let formData = new FormData(name, confimed);

    xhr.open('POST', `http://localhost:3000/invitees/`);
    //formData.append(name, 0);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.send(`name=${name}&confirmed=0`);

    xhr.onload = function() {
      if (xhr.status != 201) { // analyze HTTP status of the response
        alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
      } else { // show the result

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
    const li = createLI(text);

    ul.appendChild(li);
  });

  ul.addEventListener('change', (e) => {
    const checkBox = e.target;
    const checked = checkBox.checked;
    const listItem = checkBox.parentNode.parentNode;

    if(checked) {
      listItem.className = 'responded';
    } else {
      listItem.className = '';
    }
  });

  ul.addEventListener('click', (e) => {
    if(e.target.tagName === 'BUTTON') {
      const button = e.target;
      const li = button.parentNode;
      const action = button.textContent;
      const nameActions = {
        remove:  () => {
          removeInviteeAsync(li);
        },
        edit: () => {
          const span = li.firstElementChild;
          const input = document.createElement('input');
          input.type = 'text';
          input.value = span.textContent;
          li.insertBefore(input, span);
          li.removeChild(span);
          button.textContent = 'save';
        },
        save: () => {
          const input = li.firstElementChild;
          const span = document.createElement('span');
          span.textContent = input.value;
          li.insertBefore(span, input);
          li.removeChild(input);
          button.textContent = 'edit';
        }
      };

      nameActions[action]();
    }
  });
});
