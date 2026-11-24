import React, { useEffect } from "react";
import { Box, Container, Tabs } from "@mui/material";
import Tab from "@mui/material/Tab";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import { useLocation } from "react-router-dom";
import "../../../css/help.css";
import { faq } from "../../../lib/data/faq";
import { terms } from "../../../lib/data/terms";
import ContactPage from "../contactPage";

const helpTabFromSearch = (search: string) => {
  const tab = new URLSearchParams(search).get("tab");
  if (tab === "faq") return "2";
  if (tab === "contact") return "3";
  return "1";
};

export default function HelpPage() {
  const location = useLocation();
  const [value, setValue] = React.useState(() => helpTabFromSearch(location.search));

  useEffect(() => {
    setValue(helpTabFromSearch(location.search));
  }, [location.search]);

  /** HANDLERS **/
  
  const handleChange = (e: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className={"help-page"}>
      <Container className={"help-container"}>
        <header className="help-heading">
          <span>TECHANOR SUPPORT</span>
          <h1>How can we help?</h1>
          <p>Find clear answers about shopping, orders and delivery, or get in touch with our support team.</p>
        </header>
        <TabContext value={value}>
          <Box className={"help-menu"}>
            <Box className="help-tabs-border">
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="lab API tabs example"
                className={"table_list"}
              >
                <Tab label="TERMS" value={"1"} />
                <Tab label="FAQ" value={"2"} />
                <Tab label="CONTACT" value={"3"} />
              </Tabs>
            </Box>
          </Box>
          <div className={"help-main-content"}>
              <TabPanel className="help-tab-panel" value={"1"}>
                <div className={"rules-box"}>
                  {terms.map((term, number) => (
                    <article className="help-term-card" key={term.title}>
                      <span>{String(number + 1).padStart(2, "0")}</span>
                      <div><h2>{term.title}</h2><p>{term.body}</p></div>
                    </article>
                  ))}
                </div>
              </TabPanel>
              <TabPanel className="help-tab-panel" value={"2"}>
                <div className={"accordion-menu"}>
                  {faq.map((value, number) => {
                    return (
                      <Accordion disableGutters elevation={0} key={value.question}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`faq-${number}-content`}
                          id={`faq-${number}-header`}
                        >
                          <span className="faq-number">{String(number + 1).padStart(2, "0")}</span>
                          <h2>{value.question}</h2>
                        </AccordionSummary>
                        <AccordionDetails id={`faq-${number}-content`}>
                          <p>{value.answer}</p>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </div>
              </TabPanel>
              <TabPanel className="help-contact-panel" value={"3"}>
                <ContactPage embedded />
              </TabPanel>
          </div>
        </TabContext>
      </Container>
    </div>
  );
}
