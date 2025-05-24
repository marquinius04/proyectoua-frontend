import "./SkillIconsInstagram.css";

export const SkillIconsInstagram = ({ className, ...props }) => {
  return (
    <div className={"skill-icons-instagram " + className}>
      <img 
      className="group" 
      src="https://www.dropbox.com/scl/fi/0xeuxrl2h8a4q6stgjtlc/group0.svg?rlkey=ig55j2lhhmppv8ktbbjt9f1y4&st=c5qugxjz&raw=1" 
      alt="Instagram Icon"
      tabIndex={0} // Makes the icon focusable
      />
    </div>
  );
};
