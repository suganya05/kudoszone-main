import React, { ReactNode, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import "./FilterLayout.scss";
import Dropdown from "components/Dropdown";
import { ReactComponent as Filter } from "assets/icons/filter.svg";
import { ReactComponent as UpArrow } from "assets/icons/up_arrow.svg";
import { ReactComponent as Search } from "assets/icons/search.svg";
import { useDebounce, useMediaQuery } from "usehooks-ts";
import { useIsFirstRender, useLockedBody, useUpdateEffect } from "hooks";

interface IFilterLayout {
  renderFilterBox: ReactNode;
  renderMain: ReactNode;
  onMountOpenFilter?: boolean;
  dropdownFilter: { label: string; value: string }[];
  handleChangeDropdown: (val: string) => void;
  handleChangeInput?: (val: string) => void;
}

const FilterLayout: React.FC<IFilterLayout> = ({
  renderMain,
  renderFilterBox,
  onMountOpenFilter = false,
  dropdownFilter,
  handleChangeDropdown,
  handleChangeInput,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(onMountOpenFilter);
  const [searchInput, setSearchInput] = useState("");
  const debouncedValue = useDebounce(searchInput, 1000);
  const matches = useMediaQuery("(max-width: 576px)");
  const { setLocked } = useLockedBody();
  const firstRender = useIsFirstRender();

  useUpdateEffect(() => {
    if (matches && isFilterOpen) {
      setIsFilterOpen(false);
    }
  }, [firstRender, matches]);

  useMemo(() => {
    if (matches && isFilterOpen) {
      return setLocked(true);
    }
    setLocked(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches, isFilterOpen]);

  useMemo(() => {
    if (handleChangeInput) handleChangeInput(debouncedValue);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <main className="main-container">
      <div className="main-header">
        <div className="filterlayout">
          <section className="filterlayout_container">
            {renderFilterBox && (
              <div
                className="filterlayout_container-controls"
                onClick={() => setIsFilterOpen((f) => !f)}
              >
                {isFilterOpen ? (
                  <UpArrow style={{ transform: "rotate(-90deg)" }} />
                ) : (
                  <Filter />
                )}
              </div>
            )}
            <div className="filterlayout_container-searchbox">
              <div className="searchbox-wrapper">
                <Search />
                <input
                  min="0"
                  type="number"
                  placeholder="Token ID..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>
            <Dropdown
              list={dropdownFilter}
              handleChange={(val) => handleChangeDropdown(val.value)}
              className="filterlayout-dropdown"
            />
          </section>
        </div>
      </div>
      <div className="main-content">
        <AnimatePresence initial={false}>
          <motion.aside layout className="aside_wrapper">
            {isFilterOpen && (
              <motion.div
                className="filter_sidebar"
                key="content"
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: { opacity: 1, x: 0 },
                  collapsed: { opacity: 0, x: -280 },
                }}
                transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
              >
                <div className="filter_sidebar-content">{renderFilterBox}</div>
              </motion.div>
            )}
            <motion.main
              initial="collapsed"
              animate="open"
              exit="collapsed"
              layout
              variants={{
                open: { opacity: 1, marginLeft: isFilterOpen ? 0 : 0 },
                collapsed: { marginLeft: 0 },
              }}
              transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="content-box"
            >
              {renderMain}
            </motion.main>
          </motion.aside>
        </AnimatePresence>
      </div>
    </main>
  );
};

export default FilterLayout;
