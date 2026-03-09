import { countries } from "../../countries";
import "./DataStats.scss";

export function DataStats() {
  // Find duplicates
  const findDuplicates = (key: "iso" | "name" | "capital") => {
    const seen = new Map<string, string[]>();
    countries.forEach((c) => {
      const val = c[key].toLowerCase();
      if (!seen.has(val)) {
        seen.set(val, []);
      }
      seen.get(val)!.push(c.name);
    });
    return Array.from(seen.entries())
      .filter((entry) => entry[1].length > 1)
      .map(([value, names]) => ({ value, names }));
  };

  const isoDupes = findDuplicates("iso");
  const nameDupes = findDuplicates("name");
  const capitalDupes = findDuplicates("capital");

  // Distribution counts
  const flagDistribution = [0, 0, 0, 0, 0]; // 1-5
  const capitalDistribution = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 1-10

  countries.forEach((c) => {
    if (c.flagLevel >= 1 && c.flagLevel <= 5) {
      flagDistribution[c.flagLevel - 1]++;
    }
    if (c.capitalLevel >= 1 && c.capitalLevel <= 10) {
      capitalDistribution[c.capitalLevel - 1]++;
    }
  });

  const maxFlag = Math.max(...flagDistribution, 1);
  const maxCapital = Math.max(...capitalDistribution, 1);

  return (
    <div className="data-stats">
      <h1>📊 Statistiques des données</h1>

      <div className="data-stats__summary">
        <div className="data-stats__stat">
          <span className="data-stats__stat-value">{countries.length}</span>
          <span className="data-stats__stat-label">Pays</span>
        </div>
        <div className="data-stats__stat">
          <span className="data-stats__stat-value">
            {isoDupes.length + nameDupes.length + capitalDupes.length}
          </span>
          <span className="data-stats__stat-label">Doublons</span>
        </div>
      </div>

      {/* Duplicates */}
      <div className="data-stats__section">
        <h2>🔍 Doublons détectés</h2>

        {isoDupes.length === 0 &&
        nameDupes.length === 0 &&
        capitalDupes.length === 0 ? (
          <p className="data-stats__ok">✅ Aucun doublon détecté</p>
        ) : (
          <div className="data-stats__dupes">
            {isoDupes.length > 0 && (
              <div className="data-stats__dupe-group">
                <h3>ISO en double:</h3>
                {isoDupes.map((d, i) => (
                  <div key={i} className="data-stats__dupe-item">
                    <code>{d.value}</code> → {d.names.join(", ")}
                  </div>
                ))}
              </div>
            )}
            {nameDupes.length > 0 && (
              <div className="data-stats__dupe-group">
                <h3>Noms en double:</h3>
                {nameDupes.map((d, i) => (
                  <div key={i} className="data-stats__dupe-item">
                    <code>{d.value}</code> → {d.names.join(", ")}
                  </div>
                ))}
              </div>
            )}
            {capitalDupes.length > 0 && (
              <div className="data-stats__dupe-group">
                <h3>Capitales en double:</h3>
                {capitalDupes.map((d, i) => (
                  <div key={i} className="data-stats__dupe-item">
                    <code>{d.value}</code> → {d.names.join(", ")}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Flag distribution */}
      <div className="data-stats__section">
        <h2>🏴 Répartition difficulté drapeaux (1-5)</h2>
        <div className="data-stats__chart">
          {flagDistribution.map((count, i) => (
            <div key={i} className="data-stats__bar-wrapper">
              <div className="data-stats__bar-label">{count}</div>
              <div
                className="data-stats__bar data-stats__bar--flag"
                style={{ height: `${(count / maxFlag) * 200}px` }}
              />
              <div className="data-stats__bar-axis">{i + 1}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Capital distribution */}
      <div className="data-stats__section">
        <h2>🏛️ Répartition difficulté capitales (1-10)</h2>
        <div className="data-stats__chart">
          {capitalDistribution.map((count, i) => (
            <div key={i} className="data-stats__bar-wrapper">
              <div className="data-stats__bar-label">{count}</div>
              <div
                className="data-stats__bar data-stats__bar--capital"
                style={{ height: `${(count / maxCapital) * 200}px` }}
              />
              <div className="data-stats__bar-axis">{i + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
