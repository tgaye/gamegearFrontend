const API_BASE_URL = 'http://34.125.24.42:3000'; // Replace with the URL of your backend server

async function checkUserExistence(userAddress, gameUrl) {
  try {
    const response = await fetch(`${API_BASE_URL}/getUsernameByAddress/${userAddress}`);
    const data = await response.json();

    if (data.username) {
      window.location.href = gameUrl;
    } else {
      openUserCreationPage();
    }
  } catch (err) {
    console.log('Error getting item:', err);
  }
}

async function getUsernameByAddress(address) {
  try {
    const response = await fetch(`${API_BASE_URL}/getUsernameByAddress/${address}`);
    const data = await response.json();

    if (data.username) {
      return data.username;
    } else {
      console.log('Username not found');
    }
  } catch (error) {
    console.log('Error fetching username:', error);
  }
}

async function updateFavoritesList(userAddress, favoritesList) {
  try {
    const response = await fetch(`${API_BASE_URL}/getUsernameByAddress/${userAddress}`);
    const data = await response.json();

    if (data.username) {
      const updateParams = {
        favorites: favoritesList,
      };

      await fetch(`${API_BASE_URL}/updateFavorites/${userAddress}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateParams),
      });

      console.log('Favorites list updated successfully');
    } else {
      console.log('User does not have a username in the table');
    }
  } catch (err) {
    console.error('Error updating favorites:', err);
  }
}

async function fetchUsernamesCount() {
  try {
    const response = await fetch(`${API_BASE_URL}/fetch-username-count`);
    const data = await response.json();
    const count = data.count;
    updateWhitelistCounter(count);

    return count;
  } catch (error) {
    console.error('Error fetching usernames count:', error);
  }
}

async function addUser(event) {
  event.preventDefault(); // Prevent form submission

  // Check the current number of users
  const currentCount = await fetchUsernamesCount();
  const maxUsers = 500; // set the maxUsers here

  if (currentCount >= maxUsers) {
    alert('User limit reached, cannot add more users.');
    return;
  }

  // Retrieve form inputs
  const username = document.getElementById('username').value;
  const userAddress = document.getElementById('userAddress').value;
  const favoritesString = localStorage.getItem(userAddress);
  let favorites = favoritesString ? JSON.parse(favoritesString) : [];

  if (!favorites || favorites.length === 0) {
    favorites = ['sf2.zip', 's3comp.zip', 'tf4.zip'];
    localStorage.setItem(userAddress, JSON.stringify(favorites));
  }

  // Validate inputs
  if (!username || !userAddress) {
    alert('Please include a username, profile picture, and user address for a valid account.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, userAddress }),
    });

    const data = await response.json();
    if (data.message === 'User account created successfully' || data.message === 'User account updated successfully') {
      fetchUsernamesCount();
      returnHome();
    } else if (data.message === 'Username already exists. Please choose a different username.') {
      alert(data.message);
    }
  } catch (err) {
    console.log('Error registering user:', err);
  }
}
