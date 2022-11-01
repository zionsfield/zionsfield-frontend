import React from "react";

type Props = {};

const Home = (props: Props) => {
  const missionStatement = `
  To provide individualized education that addresses students unique learning
  styles, cultivate independent thought and provide the building of character
  enabling them to contribute to their communities in meaningful and positive 
  ways.
  `;
  const visionStatement = `
  To educate young ones in such a manner that they unlock their potentials,
  acquire good character and strive to fit into to today's world.
  `;
  const schoolAnthemP1 = `
  Zionsfield is a happy home
  And we are very happy to be here
  Excelling in all things we say and do
  Our school motto is our guide
  `;
  const schoolAnthemP2 = `
  We are grateful to God on high
  Who brought us to this happy home
  To our teachers our love we give
  We are very happy to be here
  `;

  const schoolAnthemP3 = `
  While we are here
  We keep all rules
  We read and we pray and play
  We conduct ourselves in the way to go
  To our greater nation and all
  We are grateful to God on high
  Who brought us to this happy home
  To our parents our love we give
  We are very happy to be here`;

  const schoolRules = [
    "Don't slide on the tiles",
    "Don't run on the walkway or staircase",
    `Don't play ball with your school uniform on the street or in the classroom`,
    `Don't chew gum in the school premises or eat while teaching is going on`,
    "Throw refuse only into the dustbin",
    `Don't make noise or use abusive words in the classroom and school premises`,
    "Don't leave your belongings in the school premises",
    "Don't take what does not belong to you",
    "Dress appropriately and neatly to school",
    "Don't come to school late",
    "Clean up the toilet after use",
    `Take permission before entering the staff room or entering / leaving a classroom when a teacher is present`,
    `Learn to greet and don't speak vernacular in the school premises`,
    `Learn to use the five magic words: please, excuse me, sorry, thank you, pardon me`,
    `Student must not use phone in the school premises`,
  ];
  const getSchoolAnthemLines = (paragraph: string) => {
    return paragraph
      .split("\n")
      .filter((line) => !!line)
      .map((line) => <p key={line}>{line}</p>);
  };
  return (
    <div className="mt-4 max-w-7xl mx-auto space-y-2 px-3">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Mission Statement</h1>
        <div>{missionStatement}</div>
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Vision Statement</h1>
        <div>{visionStatement}</div>
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">School Anthem</h1>
        <div className="">{getSchoolAnthemLines(schoolAnthemP1)}</div>
        <div className="">{getSchoolAnthemLines(schoolAnthemP2)}</div>
        <div className="">{getSchoolAnthemLines(schoolAnthemP3)}</div>
      </div>
      <div>
        <h1 className="text-2xl font-bold">School Rules</h1>
        <div>
          {schoolRules.map((rule, i) => (
            <p key={rule} className="space-x-2">
              <span>{i + 1})</span> <span>{rule}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
