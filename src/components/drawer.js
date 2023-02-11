import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  IconButton,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import "./drawer.css";

const Select = ({ name, onChange, value, options, typedemande }) => {
  return (
    <select name={name} onChange={(e) => onChange(e)} className="select">
      <option value="">Add Schema</option>
      {options.map((item) => (
        <option value={item.value} label={item.label} id={item.id}>
          {item.label}
        </option>
      ))}
    </select>
  );
};

function SideDrawer() {
  const [name, setName] = useState("");
  const [refValue, setValue] = useState();
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState([{ value: null }]);
  const [iniitlaRender, setInitialRender] = useState(false);
  const [finalObj, setFinalObj] = useState({
    segment_name: "",
    schema: [{}],
  });

  const [schemas, setSchemas] = useState([
    { value: "First Name", label: "First Name", id: "first_name" },
    { value: "Last Name", label: "Last Name", id: "last_name" },
    { value: "Gender", label: "Gender", id: "gender" },
    { value: "Account Name", label: "Account Name", id: "account_name" },
    { value: "Age", label: "Age", id: "age" },
    { value: "City", label: "City", id: "city" },
    { value: "State", label: "State", id: "state" },
  ]);

  const [dropdowns, setDrodowns] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    account_name: "",
    age: "",
    city: "",
    state: "",
  });

  const getName = (e) => {
    setName(e.target.value);
  };

  const addSchema = () => {
    const values = [...fields];
    values.push({ value: null });
    setFields(values);
    // const details = schemas?.filter((item) => {
    //   return item.value !== refValue;
    // });

    // setSchemas(details);
  };

  const handleSelectChange = (event) => {
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("id");
    setDrodowns({ ...dropdowns, [option]: event.target.value });
    setValue(event.target.value);
    // const details = schemas?.filter((item) => {
    //   return item.value !== event.target.value;
    // });

    // console.log(details);
    // setSchemas(details);
  };

  const handleSubmit = () => {
    Object.keys(dropdowns).forEach(
      (key) =>
        (dropdowns[key] == null || dropdowns[key] === "") &&
        delete dropdowns[key]
    );
    setFinalObj({ segment_name: name, schema: [dropdowns] });
  };

  useEffect(() => {
    if (iniitlaRender === false) {
      setInitialRender(true);
    } else {
      const finalJson = JSON.stringify(finalObj);
      fetch("https://webhook.site/bd99b48e-4628-4bff-b81d-244a782b4841", {
        method: "POST",
        body: JSON.stringify(finalJson),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalObj]);

  return (
    <div>
      <button className="save" onClick={() => setOpen(true)}>
        Save Segment
      </button>
      <Drawer
        PaperProps={{
          sx: {
            width: 400,
          },
        }}
        anchor={"right"}
        open={open}
        onClose={() => setOpen(false)}>
        <Box
          sx={{
            backgroundColor: "#2d7a7a",
            display: "flex",
            alignItems: "center",
          }}>
          <IconButton onClick={() => setOpen(false)}>
            <ChevronLeftIcon style={{ color: "white" }} />
          </IconButton>
          <Typography sx={{ color: "white" }} variant="h6" component="h6">
            Saving Segment
          </Typography>
        </Box>

        <Divider />
        <List
          sx={{
            paddingLeft: 3,
            paddingRight: 3,
            paddingTop: 3,
          }}>
          <div className="segment-wrapper">
            <div className="segment-name-section">
              <p>Enter the name of the segment</p>
              <input
                className="input"
                onChange={(e) => getName(e)}
                placeholder="Name of the segment"
              />
            </div>
            <div className="segment-schema-section">
              <p>To save your segment, you need add schemas to build query</p>
            </div>
          </div>
          {fields.map((item, idx) => {
            return (
              <div>
                <Select onChange={handleSelectChange} options={schemas} />
              </div>
            );
          })}
          <button className="add-button" onClick={addSchema}>
            + Add New Schema
          </button>
        </List>
        <div className="footer">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}>
            <button onClick={handleSubmit} className="save">
              Save the segment
            </button>
            <button className="cancel">cancel</button>
          </Box>
        </div>
      </Drawer>
    </div>
  );
}

export default SideDrawer;
