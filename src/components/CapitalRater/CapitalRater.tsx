import { useState, useEffect, useMemo } from "react";
import { countries } from "../../countries";
import { getFlagUrl, preloadFlags } from "../../utils";
import "./CapitalRater.scss";

interface CountryItem {
  iso: string;
  name: string;
  capital: string;
  oldLevel: number;
}

type ListId = "pool" | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export function CapitalRater() {
  // Filter only countries with capitalLevel 9 or 10
  const toRate = useMemo(
    () =>
      countries
        .filter((c) => c.capitalLevel === 9 || c.capitalLevel === 10)
        .map((c) => ({
          iso: c.iso,
          name: c.name,
          capital: c.capital,
          oldLevel: c.capitalLevel,
        })),
    [],
  );

  // Initialize lists: pool contains all, others empty
  const [lists, setLists] = useState<Record<ListId, CountryItem[]>>({
    pool: toRate,
    9: [],
    10: [],
    11: [],
    12: [],
    13: [],
    14: [],
    15: [],
  });

  const [selected, setSelected] = useState<{
    listId: ListId;
    iso: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [showJson, setShowJson] = useState(false);

  // Preload flags
  useEffect(() => {
    preloadFlags(toRate.map((c) => c.iso)).then(() => {
      setIsLoading(false);
    });
  }, [toRate]);

  const selectedItem = useMemo(() => {
    if (!selected) return null;
    const list = lists[selected.listId];
    return list.find((c) => c.iso === selected.iso) || null;
  }, [selected, lists]);

  const handleSelect = (listId: ListId, iso: string) => {
    if (selected?.listId === listId && selected?.iso === iso) {
      setSelected(null);
    } else {
      setSelected({ listId, iso });
    }
  };

  const moveToList = (targetListId: ListId) => {
    if (!selected || !selectedItem) return;
    if (selected.listId === targetListId) return;

    setLists((prev) => {
      const sourceList = prev[selected.listId].filter(
        (c) => c.iso !== selected.iso,
      );
      const targetList = [...prev[targetListId], selectedItem];

      return {
        ...prev,
        [selected.listId]: sourceList,
        [targetListId]: targetList,
      };
    });

    setSelected({ listId: targetListId, iso: selected.iso });
  };

  const listIds: ListId[] = ["pool", 9, 10, 11, 12, 13, 14, 15];

  const handleHeaderClick = (listId: ListId) => {
    if (selected) {
      moveToList(listId);
    }
  };

  const generateJson = () => {
    const updates: { iso: string; capitalLevel: number }[] = [];

    for (const level of [9, 10, 11, 12, 13, 14, 15] as const) {
      for (const item of lists[level]) {
        updates.push({ iso: item.iso, capitalLevel: level });
      }
    }

    return JSON.stringify(updates, null, 2);
  };

  const poolCount = lists.pool.length;
  const assignedCount = toRate.length - poolCount;

  if (isLoading) {
    return (
      <div className="capital-rater">
        <div className="capital-rater__loading">
          <span>🌍</span>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="capital-rater">
      <div className="capital-rater__header">
        <h1>Re-classification des capitales (niveau 9-10 → 9-15)</h1>
        <div className="capital-rater__stats">
          <span>
            Attribués: {assignedCount} / {toRate.length}
          </span>
          <span>Pool: {poolCount}</span>
        </div>
        <button
          className="capital-rater__export-btn"
          onClick={() => setShowJson(!showJson)}
          disabled={poolCount > 0}
        >
          {showJson ? "Masquer JSON" : "Générer JSON"}
        </button>
      </div>

      {showJson && poolCount === 0 && (
        <div className="capital-rater__json-panel">
          <textarea
            value={generateJson()}
            readOnly
            onClick={(e) => (e.target as HTMLTextAreaElement).select()}
          />
          <button onClick={() => navigator.clipboard.writeText(generateJson())}>
            📋 Copier
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="capital-rater__controls">
        {selectedItem ? (
          <div className="capital-rater__selected-info">
            {getFlagUrl(selectedItem.iso) && (
              <img
                src={getFlagUrl(selectedItem.iso)}
                alt={selectedItem.name}
                className="capital-rater__selected-flag"
              />
            )}
            <div>
              <strong>{selectedItem.name}</strong>
              <span>{selectedItem.capital}</span>
            </div>
            <span className="capital-rater__hint-move">
              → Cliquez sur un en-tête de colonne pour déplacer
            </span>
          </div>
        ) : (
          <div className="capital-rater__hint">
            Cliquez sur une capitale pour la sélectionner
          </div>
        )}
      </div>

      {/* Lists container */}
      <div className="capital-rater__lists">
        {listIds.map((listId) => (
          <div key={listId} className="capital-rater__list">
            <div
              className={`capital-rater__list-header ${selected && selected.listId !== listId ? "clickable" : ""}`}
              onClick={() => handleHeaderClick(listId)}
            >
              <span className="capital-rater__list-title">
                {listId === "pool" ? "📦 Pool" : `${listId}`}
              </span>
              <span className="capital-rater__list-count">
                {lists[listId].length}
              </span>
            </div>
            <div className="capital-rater__list-items">
              {lists[listId].map((item) => (
                <div
                  key={item.iso}
                  className={`capital-rater__item ${
                    selected?.iso === item.iso ? "selected" : ""
                  }`}
                  onClick={() => handleSelect(listId, item.iso)}
                >
                  {getFlagUrl(item.iso) && (
                    <img
                      src={getFlagUrl(item.iso)}
                      alt={item.name}
                      className="capital-rater__item-flag"
                    />
                  )}
                  <span className="capital-rater__item-capital">
                    {item.capital}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
