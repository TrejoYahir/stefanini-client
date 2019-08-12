function generateData() {
  let faker = require('faker');
  let _ = require('lodash');

  const userCount = 30;
  const postCount = userCount * 20;

  function makeUser(n) {
    const id = n;
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email(firstName, lastName);
    const avatar = faker.internet.avatar();
    return {
      id,
      firstName,
      lastName,
      email,
      avatar
    };
  }

  function makePost(n) {
    const id = n;
    const date = faker.date.past();
    const title = faker.hacker.phrase();
    const description = faker.lorem.paragraphs();
    const userId = faker.random.number( userCount - 1 );
    const picture = faker.image.avatar();
    return {
      id,
      date,
      title,
      description,
      userId,
      picture
    };
  }

  return {
    users: _.times(userCount, (n) => makeUser(n)),
    posts: _.times(postCount, (n) => makePost(n))
  };

}

module.exports.generateData = generateData;
